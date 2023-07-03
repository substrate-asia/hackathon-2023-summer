package p2p

import (
	"context"
	"fmt"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-miner/config"
	"metor-miner/p2p/msgpb"
	"sync"
	"time"
)

func (_this *P2P) Maintain() {
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
			//ilog.Logger.Debugf("peer connection check >>>>>")
			go _this.watchPeer()
		}
	}
}

// UpdateRouter 更新路由表和K桶
func (_this *P2P) UpdateRouter(src []*msgpb.Peer) {
	defer ihelp.ErrCatch()

	wg := sync.WaitGroup{}
	wg.Add(len(src))
	for i := range src {
		go func(i int) {
			defer ihelp.ErrCatch()
			defer wg.Done()

			//尝试连接
			addrInfo, err := peer.AddrInfoFromString(src[i].Multiaddr)
			if err != nil {
				ilog.Logger.Error(err)
				return
			}
			if addrInfo.ID.String() == _this.node.ID().String() {
				return
			}
			if err = _this.node.Connect(context.Background(), *addrInfo); err != nil {
				ilog.Logger.Error(err)
				return
			}

			//检查节点是否已经存在
			if _this.peerStore.Has(src[i].Pubkey) {
				//ilog.Logger.Debugf("节点 %s 已存在", src[i].Pubkey)
				return
			}

			//检测节点是否合法
			if _, err = _this.ChainRpc.NodeKind(src[i].Pubkey); err != nil {
				ilog.Logger.Error(err)
				return
			}

			//存储仓库
			_this.peerStore.Put(src[i].Pubkey, src[i].Multiaddr)

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
func (_this *P2P) WaitFindResp(fromPeerID peer.ID, targetPubKey string) {
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

// Bootstrap 节点启动后扩充路由表
func (_this *P2P) Bootstrap() {
	defer ihelp.ErrCatch()

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
func (_this *P2P) watchPeer() {
	defer ihelp.ErrCatch()

	_this.peerStore.Store.Range(func(key, value any) bool {
		multiAddr := value.(string)
		addrInfo, err := peer.AddrInfoFromString(multiAddr)
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
