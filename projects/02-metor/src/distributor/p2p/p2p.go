package p2p

import (
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/common"
	"metor-distributor/config"
)

var Api *Libp2p

type Libp2p struct {
	node       host.Host
	peerRouter *PeerRouter
	peerStore  *PeerStore
	chanMap    *ChanMap
	Account    common.Account
	Serializer common.Serializer
}

func (_this *Libp2p) Start() {
	defer ihelp.ErrCatch()

	_this.node = NewHost(config.Api.P2PHost)
	defer _this.node.Close()

	_this.peerStore = NewPeerStore()

	_this.peerRouter = NewPeerRouter(_this.node.ID())
	defer _this.peerRouter.bucket.Close()

	_this.chanMap = NewChanMap()

	_this.node.SetStreamHandler(pidFindPeerReq, _this.FindPeerReq)
	_this.node.SetStreamHandler(pidFindPeerResp, _this.FindPeerResp)
	_this.node.SetStreamHandler(pidGetBlockResp, _this.GetBlockResp)

	go _this.Bootstrap()
	go _this.Maintain()

	ilog.Logger.Infof("p2p id %s", _this.node.ID())
	ilog.Logger.Infof("p2p addr %v", _this.node.Addrs())

	Api = _this

	ihelp.Quit()
}

//func (_this *Libp2p) SendFile(fpath string) {
//	// 建立到另一个节点的连接
//	nodeAddr := "/ip4/127.0.0.1/tcp/8912/p2p/12D3KooWBtg73npaoYVPVjfqtTdJDynBmCk4j92Fb2u5bdygMmLa"
//	mtAddr, err := multiaddr.NewMultiaddr(nodeAddr)
//	if err != nil {
//		ilog.Logger.Error(err)
//		return
//	}
//	addrInfo, err := peer.AddrInfoFromP2pAddr(mtAddr)
//	if err != nil {
//		ilog.Logger.Error(err)
//		return
//	}
//
//	if err = _this.Node.Connect(context.Background(), *addrInfo); err != nil {
//		ilog.Logger.Error(err)
//		return
//	}
//
//	stream, err := _this.Node.NewStream(context.Background(), addrInfo.ID, "/saveblock")
//	if err != nil {
//		ilog.Logger.Error(err)
//		return
//	}
//	defer stream.Close()
//
//	//data, err := os.ReadFile("/Users/samir/Downloads/devgen.car")
//	//if err != nil {
//	//	ilog.Logger.Error(err)
//	//	return
//	//}
//	//n, err := stream.Write(data)
//	//if err != nil {
//	//	ilog.Logger.Error(err)
//	//	return
//	//}
//
//	ff, err := os.Open(fpath)
//	if err != nil {
//		ilog.Logger.Error(err)
//		return
//	}
//	defer ff.Close()
//
//	total := 0
//	buf := make([]byte, 1024*1024*2)
//	for {
//		var n int
//		n, err = ff.Read(buf)
//		if err != nil {
//			if err == io.EOF {
//				break
//			}
//			ilog.Logger.Error(err)
//			return
//		}
//		if _, err = stream.Write(buf[:n]); err != nil {
//			ilog.Logger.Error(err)
//			return
//		}
//		total += n
//	}
//
//	ilog.Logger.Infof("写数据 %d", total)
//}
