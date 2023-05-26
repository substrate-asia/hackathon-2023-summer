package p2p

import (
	"context"
	"fmt"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/config"
	"metor-distributor/p2p/proto/msgpb"
	"sync"
	"time"
)

func (_this *Libp2p) Maintain() {
	defer ihelp.ErrCatch()

	tick1 := time.NewTicker(time.Second * 30)
	defer tick1.Stop()

	tick2 := time.NewTicker(time.Second * 120)
	defer tick2.Stop()

	for {
		select {
		case <-tick1.C:
			_this.peerStore.Store.Range(func(key, value any) bool {
				fmt.Println(key, value)
				return true
			})
			_this.peerRouter.bucket.Print()
		case <-tick2.C:
			ilog.Logger.Debugf("节点维护工作开始 >>>>>")
			go _this.watchPeer()
		}
	}
}

// UpdateRouter 更新路由表和K桶
func (_this *Libp2p) UpdateRouter(src []*msgpb.Peer) {
	defer ihelp.ErrCatch()

	wg := sync.WaitGroup{}
	wg.Add(len(src))
	for i := range src {
		go func(i int) {
			defer ihelp.ErrCatch()
			defer wg.Done()

			//检查节点是否已经存在
			if _this.peerStore.Has(src[i].Pubkey) {
				ilog.Logger.Debugf("节点 %s 已存在", src[i].Pubkey)
				return
			}

			//检测节点是否合法
			kind, err := _this.Account.NodeKind(src[i].Pubkey)
			if err != nil {
				ilog.Logger.Error(err)
				return
			}

			//尝试连接
			var addrInfo *peer.AddrInfo
			addrInfo, err = peer.AddrInfoFromString(src[i].Multiaddr)
			if err != nil {
				ilog.Logger.Error(err)
				return
			}
			if err = _this.node.Connect(context.Background(), *addrInfo); err != nil {
				ilog.Logger.Error(err)
				return
			}

			//存储仓库
			_this.peerStore.Put(src[i].Pubkey, &PeerAttr{
				Kind:      PeerKind(kind),
				MultiAddr: src[i].Multiaddr,
			})

			//存储k桶
			if _, err = _this.peerRouter.bucket.TryAddPeer(addrInfo.ID, false, false); err != nil {
				ilog.Logger.Error(err)
				return
			}
		}(i)

	}
	wg.Wait()
}

// WaitFindResp 建立等待管道
func (_this *Libp2p) WaitFindResp(fromPeerID peer.ID, targetPubKey string) {
	defer ihelp.ErrCatch()
	_this.peerRouter.PutWait(targetPubKey)

	for {
		select {
		case resp := <-_this.peerRouter.GetWait(targetPubKey):
			data, err := _this.MakeMsg(resp)
			if err != nil {
				ilog.Logger.Error(err)
				break
			}
			_this.SendMsg(fromPeerID, pidFindPeerResp, data)
		case <-time.After(time.Second * 60):
			close(_this.peerRouter.GetWait(targetPubKey))
			_this.peerRouter.DelWait(targetPubKey)
			return
		}
	}
}

// SendFindPeerResp 发送查询结果
func (_this *Libp2p) SendFindPeerResp(fromPeerID peer.ID, found bool, targetPubKey string) {
	defer ihelp.ErrCatch()

	resp := &msgpb.FindPeerResp{
		TargetPubkey: targetPubKey,
		Route:        make([]*msgpb.Peer, 0),
	}
	if found {
		peerAttr, _ := _this.peerStore.Get(targetPubKey)
		resp.Route = append(resp.Route, &msgpb.Peer{
			Pubkey:    targetPubKey,
			Multiaddr: peerAttr.MultiAddr,
		})
	}

	data, err := _this.MakeMsg(resp)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//发送响应
	_this.SendMsg(fromPeerID, pidFindPeerResp, data)
}

// Bootstrap 节点启动后扩充路由表
func (_this *Libp2p) Bootstrap() {
	defer ihelp.ErrCatch()

	for _, root := range config.Core.Bootstrap {
		addrInfo, err := peer.AddrInfoFromString(root)
		if err != nil {
			ilog.Logger.Error(err)
			continue
		}
		if addrInfo.ID.String() == _this.node.ID().String() {
			continue
		}

		//尝试连接
		if err = _this.node.Connect(context.Background(), *addrInfo); err != nil {
			ilog.Logger.Error(err)
			continue
		}

		var req []byte
		if req, err = _this.MakeMsg(&msgpb.FindPeerReq{
			TargetPubkey: _this.Account.GetAddress(),
			Route:        make([]*msgpb.Peer, 0),
		}); err != nil {
			ilog.Logger.Error(err)
			continue
		}
		_this.SendMsg(addrInfo.ID, pidFindPeerReq, req)
	}
}

// MaintainPeer 维护节点
func (_this *Libp2p) watchPeer() {
	defer ihelp.ErrCatch()

	_this.peerStore.Store.Range(func(key, value any) bool {
		attr := value.(*PeerAttr)
		addrInfo, err := peer.AddrInfoFromString(attr.MultiAddr)
		if err != nil {
			ilog.Logger.Error(err)
			_this.peerStore.Store.Delete(key)
			return true
		}

		if err = _this.node.Connect(context.Background(), *addrInfo); err != nil {
			_this.peerStore.Store.Delete(key)
			_this.node.Peerstore().RemovePeer(addrInfo.ID)
			_this.peerRouter.bucket.RemovePeer(addrInfo.ID)
		}

		return true
	})
}
