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
func (_this *P2P) SendMsg(peerID peer.ID, pid protocol.ID, data []byte) error {
	defer ihelp.ErrCatch()

	stream, err := _this.Node.NewStream(context.Background(), peerID, pid)
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
	if err = _this.Serializer.Unpack(src.Data, data); err != nil {
		return
	}
	return
}

// 发送数据到矿工
func (_this *P2P) SaveBlockReq(multiAddr string, block []byte, cid []byte, siblings [][]byte, path uint32) error {
	defer ihelp.ErrCatch()

	data, err := _this.MakeMsg(&msgpb.SaveBlockReq{
		Block: block,
		Cid:   cid,
		Proof: &msgpb.SaveBlockReq_Proof{
			Siblings: siblings,
			Path:     path,
		},
	})
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}

	addrInfo, err := peer.AddrInfoFromString(multiAddr)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}

	if err = _this.Node.Connect(context.Background(), *addrInfo); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	ilog.Logger.Debugf("%s connect success", multiAddr)

	//if len(_this.Node.Peerstore().Addrs(addrInfo.ID)) == 0 {
	//	if err = _this.Node.Connect(context.Background(), *addrInfo); err != nil {
	//		ilog.Logger.Error(err)
	//		return err
	//	}
	//	ilog.Logger.Debugf("连接 %s 成功", multiAddr)
	//}

	if err = _this.SendMsg(addrInfo.ID, pidSaveBlockReq, data); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	return nil
}

// 发送读取文件请求
func (_this *P2P) FindBlockReq(ctx context.Context, multiAddr, hash string) ([]byte, error) {
	data, err := _this.MakeMsg(&msgpb.GetBlockReq{
		Hash: hash,
	})
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	addrInfo, err := peer.AddrInfoFromString(multiAddr)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	if err = _this.Node.Connect(context.Background(), *addrInfo); err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	ilog.Logger.Debugf("%s connect success", multiAddr)

	if err = _this.SendMsg(addrInfo.ID, pidGetBlockReq, data); err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	//建立等待管道
	blockChan := make(chan []byte, 1)
	defer close(blockChan)
	_this.ChanMap.Store(hash, blockChan)
	defer _this.ChanMap.Delete(hash)

	ilog.Logger.Debugf("hash = %s addr = %s", hash, multiAddr)

	for {
		select {
		case db := <-blockChan:
			return db, nil
		case <-ctx.Done():
			err = fmt.Errorf("receive block timeout [%s %s]", multiAddr, hash)
			ilog.Logger.Error(err)
			return nil, err
		}
	}
}
