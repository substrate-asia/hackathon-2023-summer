package polkadot_wallet

import (
	"MatrixAI-Client/config"
	"MatrixAI-Client/utils"
	"github.com/centrifuge/go-substrate-rpc-client/v4/signature"
)

type Wallet struct {
	KeyringPair signature.KeyringPair
	address     string
}

func InitWallet(cfg *config.Config) (*Wallet, error) {
	keypair, err := createKeyringPairFromMnemonic(cfg.Mnemonic)
	if err != nil {
		return nil, err
	}

	address, err := utils.EncodePublicKeyAsCessAccount(keypair.PublicKey)
	if err != nil {
		return nil, err
	}

	wallet := &Wallet{
		KeyringPair: keypair,
		address:     address,
	}

	return wallet, nil
}

func createKeyringPairFromMnemonic(mnemonic string) (signature.KeyringPair, error) {
	signer, err := signature.KeyringPairFromSecret(mnemonic, 0)
	if err != nil {
		return signature.KeyringPair{}, err
	}

	return signer, nil
}
