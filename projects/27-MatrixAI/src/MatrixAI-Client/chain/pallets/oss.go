package pallets

import (
	"MatrixAI-Client/chain"
	"MatrixAI-Client/logs"
	"MatrixAI-Client/pattern"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types/codec"
	"github.com/pkg/errors"
	"time"
)

type WrapperOss struct {
	*chain.InfoChain
}

func (chain *WrapperOss) Authorize(puk []byte) (string, error) {

	var (
		txhash      string
		accountInfo types.AccountInfo
	)

	address, _ := types.NewAccountID(puk)

	logs.Normal("------------------ 构建交易 ------------------")

	call, err := types.NewCall(chain.Conn.Metadata, pattern.TX_OSS_REGISTER, address)
	if err != nil {
		return txhash, err
	}

	key, err := types.CreateStorageKey(chain.Conn.Metadata, pattern.SYSTEM, pattern.ACCOUNT, chain.Wallet.KeyringPair.PublicKey)
	if err != nil {
		return txhash, err
	}

	_, err = chain.Conn.Api.RPC.State.GetStorageLatest(key, &accountInfo)
	if err != nil {
		return txhash, err
	}

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
	err = ext.Sign(chain.Wallet.KeyringPair, options)
	if err != nil {
		return txhash, err
	}

	//hash, err := chain.Conn.Api.RPC.Author.SubmitExtrinsic(ext)
	sub, err := chain.Conn.Api.RPC.Author.SubmitAndWatchExtrinsic(ext)
	if err != nil {
		return txhash, err
	}

	defer sub.Unsubscribe()
	//txhash, _ = codec.EncodeToHex(hash)

	timeout := time.NewTimer(time.Second * time.Duration(12))
	defer timeout.Stop()

	for {
		select {
		case status := <-sub.Chan():
			if status.IsInBlock {
				txhash, _ = codec.EncodeToHex(status.AsInBlock)
				return txhash, nil
			}
		case err = <-sub.Err():
			return txhash, errors.Wrap(err, "[WatchExtrinsic]")
		case <-timeout.C:
			return txhash, errors.Wrap(err, "[Watch timeout]")
		}
	}
}

func NewOssWrapper(info *chain.InfoChain) *WrapperOss {
	return &WrapperOss{info}
}
