package p2p

import (
	"context"
	"fmt"
	"github.com/gogo/protobuf/proto"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-miner/config"
	"metor-miner/p2p/msgpb"
	"time"
)

const (
	pidFindPeerReq  = "/find_peer_req/1.0.0"
	pidFindPeerResp = "/find_peer_resp/1.0.0"
	pidSaveBlockReq = "/save_block/1.0.0"
	pidGetBlockReq  = "/get_block_req/1.0.0"
	pidGetBlockResp = "/get_block_resp/1.0.0"
)

// SendMsg 发送消息
func (_this *P2P) SendMsg(peerID peer.ID, pid protocol.ID, data []byte) error {
	defer ihelp.ErrCatch()

	stream, err := _this.node.NewStream(context.Background(), peerID, pid)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}
	defer stream.Close()
	_ = stream.SetDeadline(time.Now().Add(time.Second * 60))

	if _, err = stream.Write(data); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	return nil
}

// MakeMsg 生成数据
// data 原始数据，最终生成msgpb.message
func (_this *P2P) MakeMsg(data proto.Message) ([]byte, error) {
	res, err := _this.Serializer.Pack(data)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	signature, err := _this.Account.Sign(res)
	if err != nil {
		return nil, err
	}

	message, err := _this.Serializer.Pack(&msgpb.Message{
		Data:      res,
		Signature: signature,
	})
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return message, nil
}

// ParseMsg 解析消息
// data 目标消息
func (_this *P2P) ParseMsg(buf []byte, data proto.Message) (pubkey string, err error) {
	var src msgpb.Message
	if err = _this.Serializer.Unpack(buf, &src); err != nil {
		return
	}
	//验签
	if pubkey, err = _this.Account.VerifySign(src.Data, src.Signature); err != nil {
		return
	}
	if data == nil {
		return
	}
	if err = _this.Serializer.Unpack(src.Data, data); err != nil {
		return
	}
	return
}

// SendFindPeerReq 发送节点查询请求
func (_this *P2P) SendFindPeerReq(addr string) error {
	addrInfo, err := peer.AddrInfoFromString(addr)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}
	if addrInfo.ID.String() == _this.node.ID().String() {
		err = fmt.Errorf("can not send to self")
		return err
	}

	//尝试连接
	if err = _this.node.Connect(context.Background(), *addrInfo); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	var req []byte
	if req, err = _this.MakeMsg(&msgpb.FindPeerReq{
		TargetPubkey: _this.Account.GetAddress(),
		Route:        make([]*msgpb.Peer, 0),
	}); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	if err = _this.SendMsg(addrInfo.ID, pidFindPeerReq, req); err != nil {
		return err
	}
	return nil
}

// SendFindPeerResp 发送查询结果
func (_this *P2P) SendFindPeerResp(fromPeerID peer.ID, found bool, targetPubKey string) {
	defer ihelp.ErrCatch()

	resp := &msgpb.FindPeerResp{
		TargetPubkey: targetPubKey,
		Route:        make([]*msgpb.Peer, 0),
	}
	if found {
		multiAddr, _ := _this.peerStore.Get(targetPubKey)
		resp.Route = append(resp.Route, &msgpb.Peer{
			Pubkey:    targetPubKey,
			Multiaddr: multiAddr,
		})
	}

	data, err := _this.MakeMsg(resp)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	//发送响应
	if err = _this.SendMsg(fromPeerID, pidFindPeerResp, data); err != nil {
		ilog.Logger.Error(err)
	}
}

// SendGetBlockResp 响应数据
func (_this *P2P) SendGetBlockResp(peerID peer.ID, hash string) {
	data, err := fileRead(config.Api.Home+config.Api.BlockStore, hash)
	if err != nil {
		ilog.Logger.Error("read file err")
		return
	}
	sign, err := _this.Account.Sign(data)
	if err != nil {
		ilog.Logger.Error("sign err")
		return
	}
	msg := msgpb.Message{
		Data:      data,
		Signature: sign,
	}
	data, err = _this.Serializer.Pack(&msg)
	if err != nil {
		ilog.Logger.Error("data pack err")
		return
	}
	if err = _this.SendMsg(peerID, pidGetBlockResp, data); err != nil {
		ilog.Logger.Error("data pack err")
		return
	}

	ilog.Logger.Debugf("发送block %s 完成", hash)
}
