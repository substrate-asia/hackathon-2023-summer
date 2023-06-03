package chain

import (
	"crypto/ecdsa"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"math/rand"
	"os"
	"path/filepath"
)

type Evm struct {
	//私钥
	PriKey *ecdsa.PrivateKey
	//公钥
	PubKey *ecdsa.PublicKey
}

// Wallet 生成钱包
func (_this *Evm) Wallet() error {
	fmt.Print("输入钱包密码：")
	var password string
	if _, err := fmt.Scan(&password); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	fmt.Print("确认钱包密码：")
	var repassword string
	if _, err := fmt.Scan(&repassword); err != nil {
		ilog.Logger.Error(err)
		return err
	}

	if password != repassword {
		fmt.Println("密码校验错误")
		return errors.New("密码校验错误")
	}

	ks := keystore.NewKeyStore("./keystore", keystore.StandardScryptN, keystore.StandardScryptP)
	account, err := ks.NewAccount(password)
	if err != nil {
		ilog.Logger.Error(err)
		return err
	}

	fmt.Println("路径：", account.URL.String())
	fmt.Println("地址：", account.Address.Hex())
	fmt.Println("密码：", password)
	return nil
}

func (_this *Evm) Stake() error {
	return nil
}

// DecKeystore 解析钱包
// path 钱包存放路径
// password 钱包密码
func (_this *Evm) DecKeystore(path, password string) error {
	if !ifile.IsExist(path) {
		ilog.Logger.Error("can not find keystore")
		return errors.New("can not find keystore")
	}

	fs, _ := filepath.Glob(path + "/UTC--*")
	if len(fs) == 0 {
		ilog.Logger.Error("can not find keystore file")
		return errors.New("can not find keystore file")
	}

	ksData, err := os.ReadFile(fs[0])
	if err != nil {
		ilog.Logger.Error("read keystore err >>>>> ", err)
		return err
	}

	var key *keystore.Key
	key, err = keystore.DecryptKey(ksData, password)
	if err != nil {
		ilog.Logger.Error("can not decrypt keystore >>>>> ", err)
		return err
	}

	//私钥
	_this.PriKey = key.PrivateKey
	//公钥
	pubKey, ok := key.PrivateKey.Public().(*ecdsa.PublicKey)
	if !ok {
		ilog.Logger.Error("public key is not ecdsa.publickey")
		return errors.New("public key is not ecdsa.publickey")
	}
	_this.PubKey = pubKey

	return nil
}

// Sign 数据签名
func (_this *Evm) Sign(data []byte) (signature []byte, err error) {
	hash := crypto.Keccak256Hash(data)
	signature, err = crypto.Sign(hash.Bytes(), _this.PriKey)
	if err != nil {
		ilog.Logger.Error("签名错误", err)
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

// 根据钱包查询节点类型
// 0=unkown 1=distributor 2=miner 3=validator
func (_this *Evm) NodeKind(wallet string) (kind int, err error) {
	distributor := map[string]int{
		"0xb2a1a91eA058D7Cd180234E3046E7CB467eF5D26": 0,
		"0xFD0e4dcAd3F1eF2227176c8DE4afAB7a4066886d": 0,
		"0x47b87166eF8Ce8E3350139BDBC8260D7165Fac9C": 0,
	}
	miner := map[string]int{
		"0x087b0576A81a57DbA41866D67BEAC2D2f499c688": 0,
		"0x8F392e468b19520318721973E8E22e6097796748": 0,
		"0x7046cE6e8419947FD19b8432B48E48202047395A": 0,
	}
	validator := map[string]int{
		"0xfbE0DF97f183dfF5EC5d95E850d282a3611c63A7": 0,
		"0xB60663C68aFAEd01eE7fE28fa2e3FEd0C0dbe189": 0,
		"0x520c59f2EbD1D0C61998B18C1B14923995749Fab": 0,
	}
	if _, ok := distributor[wallet]; ok {
		kind = 1
	} else if _, ok = miner[wallet]; ok {
		kind = 2
	} else if _, ok = validator[wallet]; ok {
		kind = 3
	} else {
		err = fmt.Errorf("public key is error")
	}
	return
}

// 读取钱包地址
func (_this *Evm) GetAddress() string {
	return crypto.PubkeyToAddress(*_this.PubKey).Hex()
}

// GetMiners read miners from chain
// count = indicates how many miners are needed
// filesize = File size is used for filter criteria
func (_this *Evm) GetMiners(count int, filesize int64) ([]string, error) {
	miners := []string{
		"0x087b0576A81a57DbA41866D67BEAC2D2f499c688",
		"0x8F392e468b19520318721973E8E22e6097796748",
		"0x7046cE6e8419947FD19b8432B48E48202047395A",
	}
	rand.Shuffle(len(miners), func(i, j int) {
		miners[i], miners[j] = miners[j], miners[i]
	})
	return miners, nil
}
