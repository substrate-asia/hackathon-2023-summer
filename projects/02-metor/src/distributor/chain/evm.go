package chain

import (
	"crypto/ecdsa"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/samirshao/itools/ilog"
	"os"
	"path/filepath"
)

type Evm struct {
	// private key
	PriKey *ecdsa.PrivateKey
	// public key
	PubKey *ecdsa.PublicKey
	// wallet address
	Address string
}

func NewEvm() *Evm {
	return &Evm{}
}

// DecKeystore parse keystore
func (_this *Evm) DecKeystore(keystorePath, keystorePwd string) error {
	fs, _ := filepath.Glob(keystorePath + "/UTC--*")
	if len(fs) == 0 {
		err := fmt.Errorf("can not find keystore file")
		ilog.Logger.Fatalln(err)
		return err
	}

	ksData, err := os.ReadFile(fs[0])
	if err != nil {
		ilog.Logger.Fatalln(err)
		return err
	}

	var key *keystore.Key
	key, err = keystore.DecryptKey(ksData, keystorePwd)
	if err != nil {
		ilog.Logger.Fatalln(err)
		return err
	}

	pubKey, ok := key.PrivateKey.Public().(*ecdsa.PublicKey)
	if !ok {
		err = fmt.Errorf("public key is not ecdsa.publickey")
		ilog.Logger.Fatalln(err)
		return err
	}

	_this.PriKey = key.PrivateKey
	_this.PubKey = pubKey
	_this.Address = crypto.PubkeyToAddress(*pubKey).Hex()
	return nil
}

// Wallet 生成钱包
func (_this *Evm) Wallet(keystorePath string) error {
	fmt.Print("enter wallet password：")
	var password string
	if _, err := fmt.Scan(&password); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	fmt.Print("confirm wallet password：")
	var repassword string
	if _, err := fmt.Scan(&repassword); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	if password != repassword {
		err := fmt.Errorf("password verification error")
		fmt.Println(err)
		return err
	}

	ks := keystore.NewKeyStore(keystorePath, keystore.StandardScryptN, keystore.StandardScryptP)
	account, err := ks.NewAccount(password)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}

	fmt.Println("path：", account.URL.String())
	fmt.Println("addr：", account.Address.Hex())
	return nil
}

// Sign 数据签名
func (_this *Evm) Sign(data []byte) (signature []byte, err error) {
	hash := crypto.Keccak256Hash(data)
	signature, err = crypto.Sign(hash.Bytes(), _this.PriKey)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	return
}

// VerifySign 验签
func (_this *Evm) VerifySign(data, signature []byte) (pubKey string, err error) {
	var edsa *ecdsa.PublicKey
	edsa, err = crypto.SigToPub(crypto.Keccak256Hash(data).Bytes(), signature)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	pubKey = crypto.PubkeyToAddress(*edsa).Hex()
	return
}

// GetAddress read wallet address
func (_this *Evm) GetAddress() string {
	return _this.Address
}
