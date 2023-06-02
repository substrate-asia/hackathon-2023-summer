package p2p

import (
	"bytes"
	"errors"
	eth_crypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multihash"
	"github.com/samirshao/itools/ilog"
	"io"
	"math/rand"
	"os"
)

// 读取数据流
// maxSize 设定最大接收字节数，超过最大值会返回错误
func readBuf(stream network.Stream, maxSize int) ([]byte, error) {
	data := make([]byte, 0)
	receive := 0
	for {
		buf := make([]byte, 1024)
		n, err := stream.Read(buf)
		if err != nil {
			if err == io.EOF || err == network.ErrReset {
				break
			}
			ilog.Logger.Error(err)
			return nil, err
		} else if receive > maxSize {
			stream.Close()
			ilog.Logger.Error("超出最大接收数据量")
			return nil, errors.New("超出最大接收数据量")
		}
		receive += n
		data = append(data, buf[:n]...)
	}
	return data, nil
}

// 生成一个Ed25519私钥,并写入文件
func createPem(pemPath string) (crypto.PrivKey, crypto.PubKey, error) {
	privateKey, publicKey, err := crypto.GenerateKeyPair(crypto.Ed25519, 0)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, nil, err
	}

	//写文件
	data, err := privateKey.Raw()
	if err != nil {
		ilog.Logger.Error(err)
		return nil, nil, err
	}
	err = os.WriteFile(pemPath, data, 0666)
	if err != nil {
		ilog.Logger.Fatalln(err)
		return nil, nil, err
	}

	return privateKey, publicKey, nil
}

// 从文件读取私钥
func readPem(pemPath string) (crypto.PrivKey, crypto.PubKey, error) {
	pem, err := os.ReadFile(pemPath)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, nil, err
	}
	reader := bytes.NewReader(pem)
	privateKey, publicKey, err := crypto.GenerateEd25519Key(reader)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, nil, err
	}
	return privateKey, publicKey, nil
}

// evm钱包地址转peerID
func toPeerID(src string) (peer.ID, error) {
	chash := eth_crypto.Keccak256Hash([]byte(src))
	res, err := multihash.EncodeName(chash[:], "sha256")
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	peerID, err := peer.IDFromBytes(res)
	if err != nil {
		ilog.Logger.Error(err)
		return "", err
	}
	return peerID, nil
}

// find some miner
func GetMiners(count int) []string {
	miners := make([]string, 0, count)
	Api.peerStore.Store.Range(func(key, value any) bool {
		peerAttr := value.(PeerAttr)
		if peerAttr.Kind == kindMiner {
			miners = append(miners, key.(string))
		}
		return true
	})
	//打乱顺序
	rand.Shuffle(len(miners), func(i, j int) {
		miners[i], miners[j] = miners[j], miners[i]
	})

	return miners
}

// 过滤保留可连接的矿工
func FilterMiners(miners []string) []string {
	newMiners := make([]string, 0)
	for i := range miners {
		if Api.peerStore.Has(miners[i]) {
			newMiners = append(newMiners, miners[i])
		}
	}
	return newMiners
}
