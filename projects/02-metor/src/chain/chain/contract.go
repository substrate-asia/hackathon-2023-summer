package chain

import (
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/samirshao/itools/ilog"
	"strings"
)

type ContractStruct struct {
	ContractCaller     // Read-only binding to the contract
	ContractTransactor // Write-only binding to the contract
}

type ContractCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

type ContractTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

func newContract(contractAbi string, address common.Address, backend bind.ContractBackend) (*ContractStruct, error) {
	var con ContractStruct
	parsed, err := abi.JSON(strings.NewReader(contractAbi))
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	contract := bind.NewBoundContract(address, parsed, backend, backend, nil)
	con.ContractCaller.contract = contract
	con.ContractTransactor.contract = contract
	return &con, nil
}

func (con *ContractStruct) cTransactor(opts *bind.TransactOpts, method string, params ...interface{}) (string, error) {
	transInfo, err := con.ContractTransactor.contract.Transact(opts, method, params...)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	return transInfo.Hash().String(), nil
}

func (con *ContractStruct) cCaller(opts *bind.CallOpts, method string, params ...interface{}) (*[]interface{}, error) {
	out := new([]interface{})
	err := con.ContractCaller.contract.Call(opts, out, method, params...)

	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return out, nil
}
