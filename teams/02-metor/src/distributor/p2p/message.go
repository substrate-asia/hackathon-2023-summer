package p2p

import (
	"context"
	"github.com/gogo/protobuf/proto"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/p2p/proto/msgpb"
	"time"
)

// SendMsg 发送消息
func (_this *Libp2p) SendMsg(peerID peer.ID, pid protocol.ID, data []byte) {
	defer ihelp.ErrCatch()

	stream, err := _this.node.NewStream(context.Background(), peerID, pid)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer stream.Close()
	_ = stream.SetDeadline(time.Now().Add(time.Second * 60))

	if _, err = stream.Write(data); err != nil {
		ilog.Logger.Error(err)
		return
	}
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

// 签名
//func (_this *Libp2p) signMsg(data []byte) ([]byte, error) {
//	sign, err := _this.Account.Sign(data)
//	if err != nil {
//		return nil, err
//	}
//	return _this.Serializer.Pack(&msgpb.Message{
//		Data:      data,
//		Signature: sign,
//	})
//}
