package files

import (
	"encoding/hex"
	"github.com/samirshao/itools/icrypto"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/common"
	"metor-distributor/p2p"
	"os"
	"path/filepath"
)

const (
	//分片目录
	chunkDir = "./chunks"
)

type Files struct {
	Storage    common.Storage
	Serializer common.Serializer
	Account    common.Account
}

func (_this *Files) Distribute(fpath string) {
	//check file state
	fdata, fi, err := fileinfo(fpath)
	if err != nil {
		return
	}

	// spilt file
	chunk, err := NewEsCode().Split(fdata)
	if err != nil {
		return
	}

	// make merkle tree
	tree, err := NewMerkle(chunk)
	if err != nil {
		return
	}

	// find miner and create addr
	miners := p2p.GetMiners(len(chunk))
	if len(miners) == 0 {
		ilog.Logger.Error("can not find miner")
		return
	}
	// todo test miner connect
	// save file chunk
	fileMiner := make([]string, len(chunk))
	for i := range fileMiner {
		fileMiner[i] = miners[i%len(miners)]
	}

	// 元数据
	meta := Metadata{
		Tree:  tree,
		Miner: fileMiner,
		Meta: Meta{
			Ext:  filepath.Ext(fi.Name()),
			Size: fi.Size(),
		},
	}
	// serialize metadata
	metadata, err := _this.Serializer.Pack(meta)
	if err != nil {
		return
	}
	// split metadata
	metaChunk, err := NewEsCode().Split(metadata)
	if err != nil {
		return
	}
	metaMiner := make([]string, len(metaChunk))
	for i := range metaMiner {
		metaMiner[i] = miners[i%len(miners)]
	}

	//链上矿工元数据 minerWallet : [h1,h2,h3]
	minerData := make(map[string][]string)
	for i := range chunk {
		hash := hex.EncodeToString(tree.Leaves[i])
		if err = os.WriteFile(chunkDir+"/"+hash, chunk[i], 0666); err != nil {
			ilog.Logger.Error(err)
			return
		}
		if _, ok := minerData[fileMiner[i]]; !ok {
			minerData[fileMiner[i]] = make([]string, 0)
		}
		minerData[fileMiner[i]] = append(minerData[fileMiner[i]], hash)
	}
	for i := range metaChunk {
		hash := icrypto.Sha256(metaChunk[i]).ToHex()
		if err = os.WriteFile(chunkDir+"/"+hash, metaChunk[i], 0666); err != nil {
			ilog.Logger.Error(err)
			return
		}
		if _, ok := minerData[metaMiner[i]]; !ok {
			minerData[metaMiner[i]] = make([]string, 0)
		}
		minerData[metaMiner[i]] = append(minerData[metaMiner[i]], hash)
	}

	//链上分发节点元数据 metahash : [m1:h1,m2:h2,m3:h3]
	distributorData := make(map[string][]string)
	metaHash := icrypto.Sha256(metadata).ToHex()
	distributorData[metaHash] = metaMiner

	// 元数据上链
	if _, err = _this.Account.StoreMeta(minerData, distributorData); err != nil {
		ilog.Logger.Error(err)
		return
	}

	// save metadata in leveldb
	if err = _this.Storage.Put(metaKey(metaHash), metadata); err != nil {
		ilog.Logger.Error(err)
		return
	}
}
