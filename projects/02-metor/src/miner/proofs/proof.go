package proof

import (
	"crypto/ecdsa"
	_ "embed"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/samirshao/itools/icrypto"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-miner/common"
	"metor-miner/config"
	"os"
	"strings"
	"time"
)

var (
	privateKey *ecdsa.PrivateKey
	password   = "2122735cee3f45dc2ccdcf6e5646a84c"
	//go:embed auth.key
	key []byte
)

type DataProof struct {
	Count     int
	Timestamp int64
}

type ResultProof struct {
	Data      []byte
	Signature []byte
}

type Proof struct {
	Serializer common.Serializer
	ChainRpc   common.ChainRpc
}

func init() {
	dec, err := keystore.DecryptKey(key, password)
	if err != nil {
		ilog.Logger.Fatalln(err)
		return
	}
	privateKey = dec.PrivateKey
}

func (_this *Proof) Start() {
	defer ihelp.ErrCatch()

	ilog.Logger.Infof("proof of Time and Space challenge mission begins")

	ticker := time.NewTicker(time.Second * 120)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			hashes, err := _this.ChainRpc.StoreProofTask()
			if err != nil {
				break
			}

			result, err := _this.StoreProof(hashes)
			if err != nil {
				break
			}

			err = _this.ChainRpc.StoreProof(result.Data, result.Signature)
			if err != nil {
				break
			}
		}
	}
}

func (_this *Proof) StoreProof(hashes []string) (*ResultProof, error) {
	count := 0
	for i := range hashes {
		hash, err := fileHash(hashes[i])
		if err != nil || hash != hashes[i] {
			return nil, fmt.Errorf("file not found")
		}
		count++
	}
	data, err := _this.Serializer.Pack(&DataProof{
		Count:     count,
		Timestamp: time.Now().Unix(),
	})
	if err != nil {
		return nil, err
	}
	signature, err := sign(data)
	if err != nil {
		return nil, err
	}
	return &ResultProof{
		Data:      data,
		Signature: signature,
	}, nil
}

// 读取文件
func fileHash(hash string) (string, error) {
	dest := config.Api.Home + config.Api.BlockStore + "/" + strings.ToUpper(hash[:2]) + "/" + hash
	data, err := os.ReadFile(dest)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	return icrypto.Sha256(data).ToHex(), nil
}

// Sign 数据签名
func sign(data []byte) (signature []byte, err error) {
	hash := crypto.Keccak256Hash(data)
	signature, err = crypto.Sign(hash.Bytes(), privateKey)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	return
}
