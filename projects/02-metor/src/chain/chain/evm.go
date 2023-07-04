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

// Wallet create eth wallet
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

// Sign data signature
func (_this *Evm) Sign(data []byte) (signature []byte, err error) {
	hash := crypto.Keccak256Hash(data)
	signature, err = crypto.Sign(hash.Bytes(), _this.PriKey)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	return
}

// VerifySign verify signature
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

func (_this *Evm) GetAddress() string {
	return _this.Address
}

// NodeKind 0=unkown 1=distributor 2=miner 3=validator
//func (_this *Evm) NodeKind(wallet string) (kind int, err error) {
//	distributor := map[string]int{
//		"0xb2a1a91eA058D7Cd180234E3046E7CB467eF5D26": 0,
//		"0xFD0e4dcAd3F1eF2227176c8DE4afAB7a4066886d": 0,
//		"0x47b87166eF8Ce8E3350139BDBC8260D7165Fac9C": 0,
//	}
//	miner := map[string]int{
//		"0x087b0576A81a57DbA41866D67BEAC2D2f499c688": 0,
//		"0x8F392e468b19520318721973E8E22e6097796748": 0,
//		"0x7046cE6e8419947FD19b8432B48E48202047395A": 0,
//	}
//	validator := map[string]int{
//		"0xfbE0DF97f183dfF5EC5d95E850d282a3611c63A7": 0,
//		"0xB60663C68aFAEd01eE7fE28fa2e3FEd0C0dbe189": 0,
//		"0x520c59f2EbD1D0C61998B18C1B14923995749Fab": 0,
//	}
//	if _, ok := distributor[wallet]; ok {
//		kind = 1
//	} else if _, ok = miner[wallet]; ok {
//		kind = 2
//	} else if _, ok = validator[wallet]; ok {
//		kind = 3
//	} else {
//		err = fmt.Errorf("public key is error")
//	}
//	return
//}
