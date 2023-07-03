package p2p

import (
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-miner/common"
	"metor-miner/config"
)

type P2P struct {
	node       host.Host
	peerRouter *PeerRouter
	peerStore  *PeerStore
	ChainRpc   common.ChainRpc
	Account    common.Account
	Serializer common.Serializer
}

func (_this *P2P) Start() {
	defer ihelp.ErrCatch()

	_this.node = NewHost(config.Api.P2PHost)
	defer _this.node.Close()

	_this.peerStore = NewPeerStore()

	_this.peerRouter = NewPeerRouter(_this.node.ID())
	defer _this.peerRouter.bucket.Close()

	_this.node.SetStreamHandler(pidFindPeerReq, _this.FindPeerReq)
	_this.node.SetStreamHandler(pidFindPeerResp, _this.FindPeerResp)
	_this.node.SetStreamHandler(pidSaveBlockReq, _this.SaveBlockReq)
	_this.node.SetStreamHandler(pidGetBlockReq, _this.GetBlockReq)

	go _this.Bootstrap()
	go _this.Maintain()

	ilog.Logger.Infof("p2p id %s", _this.node.ID())
	ilog.Logger.Infof("p2p addr %v", _this.node.Addrs())

	ihelp.Quit()
}
