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

	tick1 := time.NewTicker(time.Second * 60)
	defer tick1.Stop()

	tick2 := time.NewTicker(time.Second * 120)
	defer tick2.Stop()

	for {
		select {
		case <-tick1.C:
			ilog.Logger.Infof("Peer Routing Table >>>>>")
			_this.peerStore.Store.Range(func(key, value any) bool {
				fmt.Println(key, value)
				return true
			})
			fmt.Println("")
		case <-tick2.C:
			//ilog.Logger.Debugf("\npeer connection check >>>>>")
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
				//ilog.Logger.Debugf("节点 %s 已存在", src[i].Pubkey)
				return
			}

			//读取节点信息
			addrInfo, err := peer.AddrInfoFromString(src[i].Multiaddr)
			if err != nil {
				ilog.Logger.Error(err)
				return
			}
			if addrInfo.ID.String() == _this.node.ID().String() {
				return
			}

			//检测节点是否合法
			kind, err := _this.Account.NodeKind(src[i].Pubkey)
			if err != nil {
				ilog.Logger.Error(err)
				return
			}

			//尝试连接
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
			if err = _this.SendMsg(fromPeerID, pidFindPeerResp, data); err != nil {
				ilog.Logger.Error(err)
				break
			}
		case <-time.After(time.Second * 60):
			close(_this.peerRouter.GetWait(targetPubKey))
			_this.peerRouter.DelWait(targetPubKey)
			return
		}
	}
}

// Bootstrap 节点启动后扩充路由表
func (_this *Libp2p) Bootstrap() {
	defer ihelp.ErrCatch()

	if len(config.Api.Bootstrap) == 0 {
		return
	}

	tick := time.NewTicker(time.Second * 5)
	defer tick.Stop()

	for {
		select {
		case <-tick.C:
			done := 0
			for _, root := range config.Api.Bootstrap {
				if err := _this.SendFindPeerReq(root); err != nil {
					continue
				}
				done++
			}
			if done > 0 {
				return
			}
		}
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
