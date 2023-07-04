package chain

import (
	"MatrixAI-Client/chain/conn"
	polkadot_wallet "MatrixAI-Client/chain/wallet"
	"MatrixAI-Client/config"
	"MatrixAI-Client/pattern"
	"fmt"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
)

// InfoChain 结构体用于存放conn\wallet信息
type InfoChain struct {
	Conn   *conn.Conn
	Wallet *polkadot_wallet.Wallet
}

// GetChainInfo 创建conn\wallet信息并返回ChainInfo
func GetChainInfo(cfg *config.Config) (*InfoChain, error) {
	newConn, err := conn.NewConn(cfg.ChainRPC)
	if err != nil {
		return nil, err
	}

	wallet, err := polkadot_wallet.InitWallet(cfg)
	if err != nil {
		return nil, err
	}

	chainInfo := &InfoChain{
		Conn:   newConn,
		Wallet: wallet,
	}

	return chainInfo, nil
}

func (chain *InfoChain) GetNonce(accountInfo *types.AccountInfo) error {
	key, err := types.CreateStorageKey(chain.Conn.Metadata, pattern.SYSTEM, pattern.ACCOUNT, chain.Wallet.KeyringPair.PublicKey)
	if err != nil {
		return fmt.Errorf("error creating %s %s storage key: %v", pattern.SYSTEM, pattern.ACCOUNT, err)
	}

	_, err = chain.Conn.Api.RPC.State.GetStorageLatest(key, &accountInfo)
	if err != nil {
		return fmt.Errorf("error getting storage latest: %v", err)
	}
	return nil
}

func (chain *InfoChain) GetSign(accountInfo types.AccountInfo, call types.Call) (types.Extrinsic, error) {
	options := types.SignatureOptions{
		BlockHash:          chain.Conn.GenesisHash,
		Era:                types.ExtrinsicEra{IsMortalEra: false},
		GenesisHash:        chain.Conn.GenesisHash,
		Nonce:              types.NewUCompactFromUInt(uint64(accountInfo.Nonce)),
		SpecVersion:        chain.Conn.RuntimeVersion.SpecVersion,
		Tip:                types.NewUCompactFromUInt(0),
		TransactionVersion: chain.Conn.RuntimeVersion.TransactionVersion,
	}

	ext := types.NewExtrinsic(call)
	err := ext.Sign(chain.Wallet.KeyringPair, options)
	if err != nil {
		return types.Extrinsic{}, fmt.Errorf("error signing the extrinsic: %v", err)
	}
	return ext, nil
}
