package chain

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/samirshao/itools/ilog"
	"math/big"
)

// GetAddressListByFunc  入参 funcName得值{allValidators|allMiners|allDistributors}
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

func (_this *Evm) Stake() (bool, error) {
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
	}, "stake", big.NewInt(0), uint8(3))
	if err != nil {
		ilog.Logger.Error(err)
		return false, err
	}
	return true, nil
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

func (_this *Evm) NodeKind(address string) (int, error) {
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

	if res.Int64() == 0 {
		return 0, fmt.Errorf("%s not in metor network", address)
	}

	return int(res.Int64()), nil
}

func (_this *Evm) PunishUser(miner string, amount int64) (string, error) {
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	chainId, err := client.ChainID(context.Background())
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(_this.PriKey, chainId)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}

	txHash, err := con.cTransactor(&bind.TransactOpts{
		Context: context.Background(),
		From:    common.HexToAddress(_this.Address),
		Signer:  auth.Signer,
	}, "punishUser", common.HexToAddress(miner), big.NewInt(0).Mul(big.NewInt(amount), big.NewInt(1e18)))
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	return txHash, nil
}

func (_this *Evm) RewardUser(miner string, amount int64) (string, error) {
	client, err := ethclient.Dial(HttpRpc)
	defer client.Close()
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	chainId, err := client.ChainID(context.Background())
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	con, err := newContract(PledgeContractAbi, common.HexToAddress(PledgeContractAddress), client)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(_this.PriKey, chainId)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}

	txHash, err := con.cTransactor(&bind.TransactOpts{
		Context: context.Background(),
		From:    common.HexToAddress(_this.Address),
		Signer:  auth.Signer,
	}, "rewardUser", common.HexToAddress(miner), big.NewInt(0).Mul(big.NewInt(amount), big.NewInt(1e18)))
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	return txHash, nil
}
