package p2p

import (
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/common"
	"metor-distributor/config"
)

type P2P struct {
	Node       host.Host
	ChanMap    *ChanMap
	Serializer common.Serializer
	Account    common.Account
}

func (_this *P2P) Start() {
	defer ihelp.ErrCatch()

	_this.Node = NewHost(config.Api.P2PHost)
	defer _this.Node.Close()

	_this.ChanMap = NewChanMap()

	_this.Node.SetStreamHandler(pidGetBlockResp, _this.FindBlockResp)

	ilog.Logger.Infof("peer.id - %s", _this.Node.ID())
	ilog.Logger.Infof("peer.addr - %v", _this.Node.Addrs())

	ihelp.Quit()
}
