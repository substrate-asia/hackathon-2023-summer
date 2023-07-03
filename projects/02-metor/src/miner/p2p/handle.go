package p2p

import (
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-miner/config"
	"metor-miner/p2p/msgpb"
)

func (_this *P2P) FindPeerReq(stream network.Stream) {
	defer ihelp.ErrCatch()
	//读取数据
	buf, err := readBuf(stream, 1024*1024)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//解析消息
	var req msgpb.FindPeerReq
	var fromPubKey string
	fromPubKey, err = _this.ParseMsg(buf, &req)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//检测来源消息是否合法
	if _, err = _this.ChainRpc.NodeKind(fromPubKey); err != nil {
		ilog.Logger.Error(err)
		return
	}

	//来源节点信息
	fromMultiAddr := stream.Conn().RemoteMultiaddr().String() + "/p2p/" + stream.Conn().RemotePeer().String()
	//把路由中的节点添加进K桶
	req.Route = append(req.Route, &msgpb.Peer{
		Pubkey:    fromPubKey,
		Multiaddr: fromMultiAddr,
	})

	//查找临节点
	var nears []peer.ID
	nears, err = _this.peerRouter.GetNearPeers(req.TargetPubkey, 20)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//检测本地是否存在目标或者ttl >= 7
	var resp bool
	var found bool
	if _this.peerStore.Has(req.TargetPubkey) {
		resp = true
		found = true
	} else if len(req.Route) >= 7 || len(nears) == 0 {
		resp = true
	}
	if resp {
		//更新路由表
		_this.UpdateRouter(req.Route)
		//发送响应
		_this.SendFindPeerResp(stream.Conn().RemotePeer(), found, req.TargetPubkey)
		return
	}

	//更新路由表
	_this.UpdateRouter(req.Route)

	//广播消息签名
	var newReq []byte
	newReq, err = _this.MakeMsg(&req)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	//配置等待管道
	go _this.WaitFindResp(stream.Conn().RemotePeer(), req.TargetPubkey)
	//广播到邻接点
	for i := range nears {
		//发送消息到邻接点
		go _this.SendMsg(nears[i], pidFindPeerReq, newReq)
	}

}

func (_this *P2P) FindPeerResp(stream network.Stream) {
	defer ihelp.ErrCatch()

	//读取数据
	buf, err := readBuf(stream, 1024*1024)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//解析消息
	var req msgpb.FindPeerResp
	var fromPubKey string
	fromPubKey, err = _this.ParseMsg(buf, &req)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//检测来源消息是否合法
	if _, err = _this.ChainRpc.NodeKind(fromPubKey); err != nil {
		ilog.Logger.Error(err)
		return
	}

	//来源节点信息并尝试连接
	fromMultiAddr := stream.Conn().RemoteMultiaddr().String() + "/p2p/" + stream.Conn().RemotePeer().String()

	//把路由中的节点添加进K桶
	req.Route = append(req.Route, &msgpb.Peer{
		Pubkey:    fromPubKey,
		Multiaddr: fromMultiAddr,
	})
	_this.UpdateRouter(req.Route)

	//检测等待管道
	if _this.peerRouter.HasWait(req.TargetPubkey) {
		_this.peerRouter.GetWait(req.TargetPubkey) <- &req
	}
}

func (_this *P2P) SaveBlockReq(stream network.Stream) {
	defer ihelp.ErrCatch()

	//读取数据
	buf, err := readBuf(stream, 1024*1024*30)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//解析消息
	var req msgpb.SaveBlockReq
	var fromPubKey string
	fromPubKey, err = _this.ParseMsg(buf, &req)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//检测来源消息是否合法
	var kind int
	if kind, err = _this.ChainRpc.NodeKind(fromPubKey); err != nil {
		ilog.Logger.Error(err)
		return
	}
	if kind != config.RoleClient {
		ilog.Logger.Warnln("peer is not distributor")
		return
	}

	//默克尔校验
	if !VerifyMerkle(req.Cid, req.Block, req.Proof.Siblings, req.Proof.Path) {
		ilog.Logger.Error("merkle verify error")
		return
	}
	////解析消息
	//var req msgpb.Message
	//if err = _this.Serializer.Unpack(buf, &req); err != nil {
	//	return
	//}
	////验签
	//var fromPubKey string
	//if fromPubKey, err = _this.Account.VerifySign(req.Data, req.Signature); err != nil {
	//	return
	//}

	//存储文件
	if err = fileStore(config.Api.Home+config.Api.BlockStore, req.Block); err != nil {
		return
	}
}

func (_this *P2P) GetBlockReq(stream network.Stream) {
	defer ihelp.ErrCatch()
	//读取数据
	buf, err := readBuf(stream, 1024)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//解析消息
	var req msgpb.GetBlockReq
	var fromPubKey string
	fromPubKey, err = _this.ParseMsg(buf, &req)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//检测来源消息是否合法
	var kind int
	if kind, err = _this.ChainRpc.NodeKind(fromPubKey); err != nil {
		ilog.Logger.Error(err)
		return
	}
	if kind != config.RoleClient {
		ilog.Logger.Error("peer is not distributor")
		return
	}

	_this.SendGetBlockResp(stream.Conn().RemotePeer(), req.Hash)
}
