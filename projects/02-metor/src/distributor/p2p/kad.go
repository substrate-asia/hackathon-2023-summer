package p2p

import (
	kbucket "github.com/libp2p/go-libp2p-kbucket"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/p2p/host/peerstore"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/p2p/proto/msgpb"
	"sync"
	"time"
)

type PeerRouter struct {
	//k桶
	bucket *kbucket.RoutingTable
	//消息响应对应的来路节点
	waitStore *sync.Map
}

// K桶
func NewPeerRouter(selfID peer.ID) *PeerRouter {
	kb, err := kbucket.NewRoutingTable(20, kbucket.ConvertPeerID(selfID), 1*time.Minute, peerstore.NewMetrics(), 1*time.Hour, nil)
	if err != nil {
		ilog.Logger.Fatalln(err)
		return nil
	}
	return &PeerRouter{bucket: kb, waitStore: new(sync.Map)}
}

// GetNearPeers 读取临节点
func (_this *PeerRouter) GetNearPeers(pubkey string, count int) ([]peer.ID, error) {
	peerID, err := toPeerID(pubkey)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	nears := _this.bucket.NearestPeers(kbucket.ConvertPeerID(peerID), count)
	return nears, nil
}

// PutWait 设置等待管道
func (_this *PeerRouter) PutWait(pubkey string) {
	ch := make(chan *msgpb.FindPeerResp)
	_this.waitStore.Store(pubkey, ch)
}

// DelWait 删除等待管道
func (_this *PeerRouter) DelWait(pubkey string) {
	_this.waitStore.Delete(pubkey)
}

// GetWait 读取等待管道
func (_this *PeerRouter) GetWait(pubkey string) chan *msgpb.FindPeerResp {
	ch, _ := _this.waitStore.Load(pubkey)
	return ch.(chan *msgpb.FindPeerResp)
}

// HasWait 检测是否存在等待管道
func (_this *PeerRouter) HasWait(pubkey string) bool {
	_, ok := _this.waitStore.Load(pubkey)
	return ok
}
