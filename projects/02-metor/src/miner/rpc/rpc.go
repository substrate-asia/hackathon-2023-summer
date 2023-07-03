package rpc

import (
	"context"
	"github.com/gogo/protobuf/proto"
	"github.com/samirshao/itools/ilog"
	"google.golang.org/grpc"
	"metor-miner/common"
	"metor-miner/config"
	"metor-miner/rpc/matchpb"
	"time"
)

type RpcObj struct {
	Account    common.Account
	Serializer common.Serializer
}

// NewClient 建立rpc连接
func newConn() (*grpc.ClientConn, error) {
	opts := []grpc.DialOption{
		grpc.WithInsecure(),
		grpc.WithBlock(),
		grpc.WithTimeout(time.Second * 10),
	}
	return grpc.Dial(config.Api.ChainRpc, opts...)
}

func NewChainRpc(account common.Account, serializer common.Serializer) *RpcObj {
	return &RpcObj{
		Account:    account,
		Serializer: serializer,
	}
}

func (_this *RpcObj) NodeKind(address string) (role int, err error) {
	conn, err := newConn()
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer conn.Close()

	var data matchpb.Message
	if data, err = _this.signMsg(&matchpb.FindRoleReq{
		Address: address,
	}); err != nil {
		ilog.Logger.Error(err)
		return
	}

	c := matchpb.NewMatchClient(conn)
	res, err := c.FindRole(context.Background(), &data)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	return int(res.Role), nil
}

func (_this *RpcObj) StoreProofTask() (hashes []string, err error) {
	conn, err := newConn()
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer conn.Close()

	var data matchpb.Message
	if data, err = _this.signMsg(&matchpb.StoreProofTaskReq{
		Timestamp: time.Now().Unix(),
	}); err != nil {
		ilog.Logger.Error(err)
		return
	}

	c := matchpb.NewMatchClient(conn)
	res, err := c.StoreProofTask(context.Background(), &data)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	return res.Hashes, nil
}

func (_this *RpcObj) StoreProof(srcData, signature []byte) error {
	conn, err := newConn()
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}
	defer conn.Close()

	var data matchpb.Message
	if data, err = _this.signMsg(&matchpb.StoreProofReq{
		Data:      srcData,
		Signature: signature,
	}); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	c := matchpb.NewMatchClient(conn)
	res, err := c.StoreProof(context.Background(), &data)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}
	ilog.Logger.Infof("时空证明：%s", res.TxHash)
	return nil
}

func (_this *RpcObj) signMsg(src proto.Message) (message matchpb.Message, err error) {
	var data []byte
	data, err = _this.Serializer.Pack(src)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	var signature []byte
	signature, err = _this.Account.Sign(data)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	message.Data = data
	message.Signature = signature

	return
}
