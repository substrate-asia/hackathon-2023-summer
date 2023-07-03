package chain

import (
	"context"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/samirshao/itools/ilog"
	"math/big"
	"time"
)

type distrData struct {
	ChunkHash []string
	Miner     []string
}

func (_this *Evm) StoreMeta(miner map[string][]string, distributor map[string][]map[string]string) (string, error) {
	return "", nil
}

func (_this *Evm) ApproveToken(amount int64) (bool, error) {
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	chainId, err := client.ChainID(context.Background())
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	con, err := newContract(MockTokenContractAbi, common.HexToAddress(MockTokenContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(_this.PriKey, chainId)
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}

	_, err = con.cTransactor(&bind.TransactOpts{
		Context: context.Background(),
		From:    common.HexToAddress(_this.Address),
		Signer:  auth.Signer,
	}, "approve", common.HexToAddress(PledgeContractAddress), big.NewInt(0).Mul(big.NewInt(amount), big.NewInt(1e18)))
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	return true, nil
	//callMsg, err := getTxState(client, txHash)
	//if err != nil {
	//	ilog.Logger.Error(err)
	//	return false, err
	//}
	//return callMsg, err
}

func (_this *Evm) BuyStorage(store, days int64) (bool, error) {
	ok, err := _this.ApproveToken(store)
	if err != nil || !ok {
		ilog.Logger.Error(err)
		return false, err
	}

	time.Sleep(time.Second * 10)

	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	chainId, err := client.ChainID(context.Background())
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	auth, err := bind.NewKeyedTransactorWithChainID(_this.PriKey, chainId)
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	_, err = con.cTransactor(&bind.TransactOpts{
		Context: context.Background(),
		From:    common.HexToAddress(_this.Address),
		Signer:  auth.Signer,
	}, "buyStorage", big.NewInt(store), big.NewInt(days))
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	return true, nil
}

func (_this *Evm) getRole(address string) (int64, error) {
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return 0, err
	}
	defer client.Close()
	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return 0, err
	}
	caller, err := con.cCaller(&bind.CallOpts{}, "getUerRole", common.HexToAddress(address))
	if err != nil {
		ilog.Logger.Error(err)
		return 0, err
	}
	res := (*caller)[0].(*big.Int)
	return res.Int64(), nil
}
