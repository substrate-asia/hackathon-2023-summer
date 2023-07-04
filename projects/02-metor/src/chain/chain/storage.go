package chain

import (
	"context"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/samirshao/itools/ilog"
	"math/big"
)

//func (_this *Evm) UploadMetaData(miners, fileHash []string, ext, cid, user string, size, blockSize int64, dataShards, parityShards int) (TxHash string, err error) {
//	client, err := ethclient.Dial(HttpRpc)
//	defer client.Close()
//	if err != nil {
//		ilog.Logger.Error(err)
//		return "", err
//	}
//	chainId, err := client.ChainID(context.Background())
//	if err != nil {
//		ilog.Logger.Error(err)
//		return "", err
//	}
//	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
//	if err != nil {
//		ilog.Logger.Error(err)
//		return "", err
//	}
//	auth, err := bind.NewKeyedTransactorWithChainID(_this.PriKey, chainId)
//	if err != nil {
//		ilog.Logger.Error(err)
//		return "", err
//	}
//
//	addressList := make([]common.Address, len(miners))
//	for k, v := range miners {
//		addressList[k] = common.HexToAddress(v)
//	}
//	txHash, err := con.cTransactor(&bind.TransactOpts{
//		Context: context.Background(),
//		From:    common.HexToAddress(_this.Address),
//		Signer:  auth.Signer,
//	}, "uploadMetaData", addressList, fileHash, ext, cid, big.NewInt(size), big.NewInt(blockSize), big.NewInt(int64(dataShards)), big.NewInt(int64(parityShards)), user) // 声明方法
//	if err != nil {
//		ilog.Logger.Error(err)
//		return "", err
//	}
//	return txHash, err
//}

func (_this *Evm) UploadMetaData(miners, fileHash []string, ext, cid, user string, size, blockSize int64, dataShards, parityShards int) (TxHash string, err error) {
	p1 := make([]common.Address, len(miners))
	for k, v := range miners {
		p1[k] = common.HexToAddress(v)
	}
	p5 := big.NewInt(size)
	p6 := big.NewInt(blockSize)
	p7 := big.NewInt(int64(dataShards))
	p8 := big.NewInt(int64(parityShards))

	p9 := common.HexToAddress(user)

	args := abi.Arguments{
		abi.Argument{
			Type: abi.Type{T: abi.SliceTy, Elem: &abi.Type{T: abi.AddressTy}},
		},
		abi.Argument{
			Type: abi.Type{T: abi.SliceTy, Elem: &abi.Type{T: abi.StringTy}},
		},
		abi.Argument{
			Type: abi.Type{T: abi.StringTy},
		},
		abi.Argument{
			Type: abi.Type{T: abi.StringTy},
		},
		abi.Argument{
			Type: abi.Type{T: abi.UintTy},
		},
		abi.Argument{
			Type: abi.Type{T: abi.UintTy},
		},
		abi.Argument{
			Type: abi.Type{T: abi.UintTy},
		},
		abi.Argument{
			Type: abi.Type{T: abi.UintTy},
		},
		abi.Argument{
			Type: abi.Type{T: abi.AddressTy},
		},
	}
	pack, err := args.Pack(p1, fileHash, ext, cid, p5, p6, p7, p8, p9)
	if err != nil {
		ilog.Logger.Error(err)
	}
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
	}
	chainId, err := client.ChainID(context.Background())
	if err != nil {
		ilog.Logger.Error(err)
	}
	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
	}

	//privateKey, err := crypto.HexToECDSA("bdf878ea925c424103c8f33ab72b27718eb9c04cbcd9a25c5d49847e60f12022")
	//if err != nil {
	//	ilog.Logger.Error(err)
	//}
	//publicKey := privateKey.Public()
	//publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	//if !ok {
	//	log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	//}
	//fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	auth, err := bind.NewKeyedTransactorWithChainID(_this.PriKey, chainId)
	if err != nil {
		ilog.Logger.Error(err)
	}

	txHash, err := con.cTransactor(&bind.TransactOpts{
		Context: context.Background(),
		From:    common.HexToAddress(_this.Address),
		Signer:  auth.Signer,
	}, "uploadMetaDataBytes", pack)
	if err != nil {
		ilog.Logger.Error(err)
	}
	return txHash, nil
}

func (_this *Evm) GetMinerFileHash(miner string) ([]string, error) {
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	defer client.Close()
	con, err := newContract(StoreContractAbi, common.HexToAddress(StoreContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	caller, err := con.cCaller(&bind.CallOpts{}, "getMinerAllHash", common.HexToAddress(miner))
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return (*caller)[0].([]string), nil
}
