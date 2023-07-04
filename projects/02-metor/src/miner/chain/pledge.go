package chain

import (
	"context"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/samirshao/itools/ilog"
	"math/big"
	"time"
)

// PledgeStake role 是角色条件，1-client,2-miner，3-chain store 矿工质押的时候填写质押空间大小，另外两个角色随意填写，合约中有条件过滤逻辑
// 调用此方式之前，需要toke给合约授权
func (_this *Evm) pledgeStake(store int64, role uint8) (bool, error) {
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
	}, "stake", big.NewInt(store), role)
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

// GetAddressListByFunc  funcName = allValidators|allMiners|allDistributors
func (_this *Evm) GetAddressListByFunc(funcName string) ([]string, error) {
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	defer client.Close()
	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	caller, err := con.cCaller(&bind.CallOpts{}, funcName)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	res := make([]string, len((*caller)[0].([]common.Address)))
	for k, v := range (*caller)[0].([]common.Address) {
		res[k] = v.String()
	}
	return res, nil
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

func getTxState(client *ethclient.Client, txHash string) (bool, error) {
	time.Sleep(1 * time.Second)
	receipt, err := client.TransactionReceipt(context.Background(), common.HexToHash(txHash))
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		if err == ethereum.NotFound {
			getTxState(client, txHash)
		}
		return false, nil
	}
	switch int(receipt.Status) {
	case 1:
		return true, nil
	case 0:
		return false, nil
	default:
		println("switch default!")
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
