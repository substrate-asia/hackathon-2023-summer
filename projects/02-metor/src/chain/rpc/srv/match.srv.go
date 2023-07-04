package srv

import (
	"context"
	"github.com/gogo/protobuf/proto"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"google.golang.org/grpc/status"
	"metor-chain/common"
	"metor-chain/config"
	"metor-chain/p2p"
	"metor-chain/rpc/errs"
	"metor-chain/rpc/proto/matchpb"
)

type MatchSrv struct {
	matchpb.UnimplementedMatchServer
	Account    common.Account
	Serializer common.Serializer
}

func (_this *MatchSrv) FindMiner(ctx context.Context, req *matchpb.Message) (resp *matchpb.FindMinerResp, err error) {
	defer ihelp.ErrCatch()

	// 验签
	var src matchpb.FindMinerReq
	var address string
	if address, err = _this.parseMsg(req, &src); err != nil {
		return nil, status.Errorf(errs.ParseMsg, err.Error())
	}
	// 验证身份
	var role int
	if role, err = _this.Account.NodeKind(address); err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}
	if role != config.RoleClient {
		return nil, status.Errorf(errs.RoleUnknown, "Address is not in the current network")
	}
	// 读取矿工
	var miners []string
	miners, err = _this.Account.GetAddressListByFunc("allMiners")
	if err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.GetMiners, err.Error())
	}
	minerTotal := len(miners)
	if minerTotal == 0 {
		return nil, status.Errorf(errs.MinerZero, "can not find miner")
	}

	rows := make([]*matchpb.FindMinerRespItem, 0)
	for i := range miners {
		multiAddr, ok := p2p.GetMultiaddr(miners[i])
		if ok {
			rows = append(rows, &matchpb.FindMinerRespItem{
				Address:   miners[i],
				MultiAddr: multiAddr,
			})
		}
	}

	return &matchpb.FindMinerResp{Miners: rows}, nil
}

func (_this *MatchSrv) FindRole(ctx context.Context, req *matchpb.Message) (resp *matchpb.FindRoleResp, err error) {
	defer ihelp.ErrCatch()

	// 验签
	var src matchpb.FindRoleReq
	var address string
	if address, err = _this.parseMsg(req, &src); err != nil {
		return nil, status.Errorf(errs.ParseMsg, err.Error())
	}
	// 验证身份
	var fromRole int
	if fromRole, err = _this.Account.NodeKind(address); err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}
	if fromRole < config.RoleClient && fromRole > config.RoleChain {
		return nil, status.Errorf(errs.RoleUnknown, "Address is not in the current network")
	}

	var role int
	role, err = _this.Account.NodeKind(src.Address)
	if err != nil || (role < config.RoleClient && role > config.RoleChain) {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}

	return &matchpb.FindRoleResp{Role: uint32(role)}, nil
}

func (_this *MatchSrv) UpdMeta(ctx context.Context, req *matchpb.Message) (resp *matchpb.UpdMetaResp, err error) {
	defer ihelp.ErrCatch()

	// 验签
	var src matchpb.UpdMetaReq
	var address string
	if address, err = _this.parseMsg(req, &src); err != nil {
		return nil, status.Errorf(errs.ParseMsg, err.Error())
	}

	// 验证身份
	var role int
	if role, err = _this.Account.NodeKind(address); err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}
	if role != config.RoleClient {
		return nil, status.Errorf(errs.RoleUnknown, "Address is not in the current network")
	}

	var txHash string
	txHash, err = _this.Account.UploadMetaData(src.Miners, src.Hashes, src.Ext, src.Cid, address, src.FileSize, src.BlockSize, int(src.DataShards), int(src.ParityShards))
	if err != nil {
		return nil, status.Errorf(errs.UploadMetaData, err.Error())
	}

	ilog.Logger.Infof("write metadata success %s", txHash)

	return &matchpb.UpdMetaResp{Hash: txHash}, nil
}

func (_this *MatchSrv) FindMultiAddr(ctx context.Context, req *matchpb.Message) (*matchpb.FindMultiAddrResp, error) {
	defer ihelp.ErrCatch()

	// 验签
	var src matchpb.FindMultiAddrReq
	address, err := _this.parseMsg(req, &src)
	if err != nil {
		return nil, status.Errorf(errs.ParseMsg, err.Error())
	}

	// 验证身份
	var role int
	if role, err = _this.Account.NodeKind(address); err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}
	if role != config.RoleClient {
		return nil, status.Errorf(errs.RoleUnknown, "Address is not in the current network")
	}

	miners := make(map[string]string)
	for i := range src.Address {
		multiAddr, ok := p2p.GetMultiaddr(src.Address[i])
		if ok {
			miners[src.Address[i]] = multiAddr
		}
	}

	return &matchpb.FindMultiAddrResp{Data: miners}, nil
}

func (_this *MatchSrv) StoreProofTask(ctx context.Context, req *matchpb.Message) (*matchpb.StoreProofTaskResp, error) {
	defer ihelp.ErrCatch()

	// 验签
	var src matchpb.StoreProofTaskReq
	address, err := _this.parseMsg(req, &src)
	if err != nil {
		return nil, status.Errorf(errs.ParseMsg, err.Error())
	}

	// 验证身份
	var role int
	if role, err = _this.Account.NodeKind(address); err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}
	if role != config.RoleMiner {
		return nil, status.Errorf(errs.RoleUnknown, "Address is not in the current network")
	}

	//todo find miner's cid from contract
	hashes, err := _this.Account.GetMinerFileHash(address)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.GetMinerFileHash, err.Error())
	}
	if len(hashes) == 0 {
		return nil, status.Errorf(errs.MinerHashZero, "miner's hash is zero")
	}

	return &matchpb.StoreProofTaskResp{Hashes: hashes}, nil
}

func (_this *MatchSrv) StoreProof(ctx context.Context, req *matchpb.Message) (*matchpb.StoreProofResp, error) {
	defer ihelp.ErrCatch()

	// 验签
	var src matchpb.StoreProofReq
	address, err := _this.parseMsg(req, &src)
	if err != nil {
		return nil, status.Errorf(errs.ParseMsg, err.Error())
	}

	// 验证身份
	var role int
	if role, err = _this.Account.NodeKind(address); err != nil {
		ilog.Logger.Error(err)
		return nil, status.Errorf(errs.NodeKind, err.Error())
	}
	if role != config.RoleMiner {
		return nil, status.Errorf(errs.RoleUnknown, "Address is not in the current network")
	}

	//验签
	teeAddress, err := _this.Account.VerifySign(src.Data, src.Signature)
	if err != nil || teeAddress != config.TeePublicKey {
		ilog.Logger.Error(err)
		if _, err = _this.Account.PunishUser(address, 1); err != nil {
			ilog.Logger.Error(err)
		}
		return nil, status.Errorf(errs.VerifySign, err.Error())
	}

	//todo 激励上链
	txHash, err := _this.Account.RewardUser(address, 1)
	if err != nil {
		return nil, status.Errorf(errs.RewardUser, "")
	}
	return &matchpb.StoreProofResp{TxHash: txHash}, nil
}

func (_this *MatchSrv) parseMsg(req *matchpb.Message, src proto.Message) (address string, err error) {
	//验签
	address, err = _this.Account.VerifySign(req.Data, req.Signature)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	//解析数据
	err = _this.Serializer.Unpack(req.Data, src)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	return
}
