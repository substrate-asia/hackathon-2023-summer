package rpc

import (
	"context"
	"github.com/gogo/protobuf/proto"
	"github.com/samirshao/itools/ilog"
	"google.golang.org/grpc"
	"metor-distributor/common"
	"metor-distributor/config"
	matchpb "metor-distributor/rpc/proto/matchpb"
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

func (_this *RpcObj) GetMiners(count int, blockSize int64) (address []string, multiAddr []string, err error) {
	conn, err := newConn()
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer conn.Close()

	var data matchpb.Message
	if data, err = _this.signMsg(&matchpb.FindMinerReq{
		Count:     uint32(count),
		BlockSize: blockSize,
	}); err != nil {
		ilog.Logger.Error(err)
		return
	}

	c := matchpb.NewMatchClient(conn)
	res, err := c.FindMiner(context.Background(), &data)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	for _, v := range res.Miners {
		address = append(address, v.Address)
		multiAddr = append(multiAddr, v.MultiAddr)
	}

	return
}

func (_this *RpcObj) UpdMeta(miners, hashes []string, ext string, filesize, blockSize int64, dataShards, parityShards int, cid string) (hash string, err error) {
	conn, err := newConn()
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer conn.Close()

	var data matchpb.Message
	if data, err = _this.signMsg(&matchpb.UpdMetaReq{
		Miners:       miners,
		Hashes:       hashes,
		Ext:          ext,
		FileSize:     filesize,
		BlockSize:    blockSize,
		DataShards:   uint32(dataShards),
		ParityShards: uint32(parityShards),
		Cid:          cid,
	}); err != nil {
		ilog.Logger.Error(err)
		return
	}

	c := matchpb.NewMatchClient(conn)
	res, err := c.UpdMeta(context.Background(), &data)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	return res.Hash, nil
}

func (_this *RpcObj) FindMultiAddr(address []string) (miners map[string]string, err error) {
	conn, err := newConn()
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer conn.Close()

	var data matchpb.Message
	if data, err = _this.signMsg(&matchpb.FindMultiAddrReq{
		Address: address,
	}); err != nil {
		ilog.Logger.Error(err)
		return
	}

	c := matchpb.NewMatchClient(conn)
	res, err := c.FindMultiAddr(context.Background(), &data)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	return res.Data, nil
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
