package p2p

import (
	"context"
	"fmt"
	"github.com/gogo/protobuf/proto"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/p2p/proto/msgpb"
	"time"
)

// SendMsg 发送消息
func (_this *Libp2p) SendMsg(peerID peer.ID, pid protocol.ID, data []byte) error {
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
func (_this *Libp2p) MakeMsg(data proto.Message) ([]byte, error) {
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
func (_this *Libp2p) ParseMsg(buf []byte, data proto.Message) (pubkey string, err error) {
	var src msgpb.Message
	if err = _this.Serializer.Unpack(buf, &src); err != nil {
		return
	}
	//验签
	if pubkey, err = _this.Account.VerifySign(src.Data, src.Signature); err != nil {
		return
	}
	if err = _this.Serializer.Unpack(src.Data, data); err != nil {
		return
	}
	return
}

// 签名数据
// return msgpb.Message
func (_this *Libp2p) signMsg(data []byte) ([]byte, error) {
	sign, err := _this.Account.Sign(data)
	if err != nil {
		return nil, err
	}
	return _this.Serializer.Pack(&msgpb.Message{
		Data:      data,
		Signature: sign,
	})
}

// SendFindPeerReq 发送节点查询请求
func (_this *Libp2p) SendFindPeerReq(addr string) error {
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
	if err = _this.SendMsg(fromPeerID, pidFindPeerResp, data); err != nil {
		ilog.Logger.Error(err)
		return
	}
}

// 发送数据到矿工
func SendSaveBlockReq(miner string, data []byte) error {
	defer ihelp.ErrCatch()

	attr, ok := Api.peerStore.Get(miner)
	if !ok {
		err := fmt.Errorf("can not find miner %s", miner)
		ilog.Logger.Error(err)
		return err
	}
	if attr.Kind != kindMiner {
		err := fmt.Errorf("%s is not miner", miner)
		ilog.Logger.Error(err)
		return err
	}

	sign, err := Api.Account.Sign(data)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}
	msg := msgpb.Message{
		Data:      data,
		Signature: sign,
	}
	data, err = Api.Serializer.Pack(&msg)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}

	addrInfo, err := peer.AddrInfoFromString(attr.MultiAddr)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}

	if err = Api.SendMsg(addrInfo.ID, pidSaveBlockReq, data); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	return nil
}

// 发送读取文件请求
func SendGetBlockReq(ctx context.Context, miner, hash string) ([]byte, error) {
	data, err := Api.MakeMsg(&msgpb.GetBlockReq{
		Hash: hash,
	})
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	attr, ok := Api.peerStore.Get(miner)
	if !ok {
		err = fmt.Errorf("can not find %s", miner)
		ilog.Logger.Error(err)
		return nil, err
	}
	if attr.Kind != kindMiner {
		err = fmt.Errorf("peer %s is not miner", miner)
		ilog.Logger.Error(err)
		return nil, err
	}
	addrInfo, err := peer.AddrInfoFromString(attr.MultiAddr)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	if err = Api.SendMsg(addrInfo.ID, pidGetBlockReq, data); err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	//建立等待管道
	blockChan := make(chan []byte, 1)
	defer close(blockChan)
	key := miner + hash
	Api.chanMap.Store(key, blockChan)
	defer Api.chanMap.Delete(key)

	for {
		select {
		case db := <-blockChan:
			return db, nil
		case <-ctx.Done():
			err = fmt.Errorf("receive block timeout [%s %s]", miner, hash)
			ilog.Logger.Error(err)
			return nil, err
		}
	}
}
