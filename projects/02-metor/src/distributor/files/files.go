package files

import (
	"context"
	"fmt"
	"github.com/samirshao/itools/icrypto"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/common"
	"metor-distributor/config"
	"metor-distributor/p2p"
	"os"
	"path/filepath"
	"sync"
	"time"
)

const (
	chunkDir = "./chunks"
)

var Api *Files

type Files struct {
	Storage    common.Storage
	Serializer common.Serializer
	Account    common.Account
}

func (_this *Files) Start() {
	Api = _this
}

// Distribute Erasure code encodes files and generates metadata
func (_this *Files) Distribute(fpath string) (metaHash string, err error) {
	//get fileinfo
	var filedata []byte
	var fi os.FileInfo
	filedata, fi, err = fileinfo(fpath)
	if err != nil {
		return
	}

	// spilt file
	//var fileChunk [][]byte
	var fileEnc *SplitInfo
	fileEnc, err = new(EsCode).Split(filedata)
	if err != nil {
		return
	}
	//fcCount := len(fileEnc.Shards)

	// read miners from chain
	// filter miners, only keep those that exist in the routing table
	// assign miners to shards
	var miners []string
	if miners, err = _this.Account.GetMiners(len(fileEnc.Shards), fi.Size()); err != nil {
		ilog.Logger.Error(err)
		return
	}
	miners = p2p.FilterMiners(miners)
	if len(miners) == 0 {
		err = fmt.Errorf("can not find miner")
		ilog.Logger.Error(err)
		return
	}
	minerTotal := len(miners)

	// make block data
	blocks := make([]Block, len(fileEnc.Shards))
	for i := range fileEnc.Shards {
		blocks[i] = Block{
			Hash:  icrypto.Sha256(fileEnc.Shards[i]).ToHex(),
			Miner: miners[i%minerTotal],
		}
	}

	// make metadata
	// serialize by json
	// split metadata
	meta := Metadata{
		Blocks:       blocks,
		Ext:          filepath.Ext(fi.Name()),
		Size:         fi.Size(),
		DataShards:   fileEnc.DataShards,
		ParityShards: fileEnc.ParityShards,
	}
	var metadata []byte
	metadata, err = _this.Serializer.Pack(meta)
	if err != nil {
		return
	}
	metaHash = icrypto.Sha256(metadata).ToHex()
	//var metaChunk [][]byte
	var metaEnc *SplitInfo
	metaEnc, err = new(EsCode).Split(metadata)
	if err != nil {
		return
	}

	//链上矿工元数据 minerwallet : [h1,h2,h3]
	minerData := make(map[string][]string)
	//链上分发节点元数据 metahash : [{"chunk":h1,"miner":m1},{"chunk":h2,"miner":m2}]
	distrData := make(map[string][]map[string]string)
	distrData[metaHash] = make([]map[string]string, 0, metaEnc.DataShards+metaEnc.ParityShards)

	for i := range fileEnc.Shards {
		miner := blocks[i].Miner
		if _, ok := minerData[miner]; !ok {
			minerData[miner] = make([]string, 0)
		}
		minerData[miner] = append(minerData[miner], blocks[i].Hash)
		if err = p2p.SendSaveBlockReq(miner, fileEnc.Shards[i]); err != nil {
			ilog.Logger.Error(err)
			continue
		}
		//write file or not
		//if err = os.WriteFile(chunkDir+"/"+blocks[i].Hash, fileChunk[i], 0666); err != nil {
		//	ilog.Logger.Error(err)
		//	return
		//}
	}
	for i := range metaEnc.Shards {
		hash := icrypto.Sha256(metaEnc.Shards[i]).ToHex()
		miner := miners[i%len(miners)]
		if _, ok := minerData[miner]; !ok {
			minerData[miner] = make([]string, 0)
		}
		minerData[miner] = append(minerData[miner], hash)
		distrData[metaHash] = append(distrData[metaHash], map[string]string{
			"chunk": hash,
			"miner": miner,
		})
		if err = p2p.SendSaveBlockReq(miner, metaEnc.Shards[i]); err != nil {
			ilog.Logger.Error(err)
			continue
		}
		// write file or not
		//if err = os.WriteFile(chunkDir+"/"+hash, metaChunk[i], 0666); err != nil {
		//	ilog.Logger.Error(err)
		//	return
		//}
	}

	// todo p2p

	// 元数据上链
	if _, err = _this.Account.StoreMeta(minerData, distrData); err != nil {
		ilog.Logger.Error(err)
		return
	}

	// save metadata in leveldb
	if err = _this.Storage.Put(metaKey(metaHash), metadata); err != nil {
		ilog.Logger.Error(err)
		return
	}

	return metaHash, nil
}

// FindFile get file by cid
func (_this *Files) FindFile(cid string) (filepath string, err error) {
	// find local
	filepath = config.Api.Home + config.Api.CacheStore + "/" + cid
	if ifile.IsExist(filepath) {
		return
	}

	// find storage
	var db []byte
	db, err = _this.Storage.Get(metaKey(cid))
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	var meta Metadata
	if err = _this.Serializer.Unpack(db, &meta); err != nil {
		ilog.Logger.Error(err)
		return
	}

	// todo find chain

	blocks := make([][]byte, meta.DataShards+meta.ParityShards)
	locker := sync.Mutex{}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	wg := sync.WaitGroup{}
	wg.Add(len(meta.Blocks))
	for i := range meta.Blocks {
		go func(i int, item Block) {
			defer ihelp.ErrCatch()
			defer wg.Done()

			var block []byte
			block, err = p2p.SendGetBlockReq(ctx, item.Miner, item.Hash)
			if err != nil {
				return
			}
			locker.Lock()
			blocks[i] = block
			locker.Unlock()
		}(i, meta.Blocks[i])
	}
	wg.Wait()

	//filename := config.Api.Home + config.Api.CacheStore + "/" + cid + meta.Ext

	if err = new(EsCode).Merge(MergeInfo{
		Shards:       blocks,
		DataShards:   meta.DataShards,
		ParityShards: meta.ParityShards,
		filename:     filepath,
		filesize:     meta.Size,
	}); err != nil {
		ilog.Logger.Error(err)
		return
	}
	return
}
