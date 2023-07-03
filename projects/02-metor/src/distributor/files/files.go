package files

import (
	"context"
	"encoding/hex"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/common"
	"metor-distributor/config"
	"os"
	"path/filepath"
	"sync"
	"time"
)

const (
	chunkDir = "./chunks"
)

// var Api *Files
//var (
//	FilePathChan chan string
//)

type Files struct {
	P2Per      P2Per
	ChainRpc   ChainRpc
	Storage    common.Storage
	Serializer common.Serializer
}

// Add Erasure code encodes files and generates metadata
func (_this *Files) Add(fpath string) (cid string, err error) {
	//get fileinfo
	var filedata []byte
	var fi os.FileInfo
	filedata, fi, err = fileinfo(fpath)
	if err != nil {
		return
	}

	//纠删码分片
	var fileEnc *SplitInfo
	fileEnc, err = new(EsCode).Split(filedata)
	if err != nil {
		return
	}

	// 生成默克树
	tree, err := NewMerkle(fileEnc.Shards)
	if err != nil {
		return
	}
	cid = hex.EncodeToString(tree.Root)

	// 从区块链节点读取矿工钱包地址和p2p地址
	var srcMiners []string
	var srcAddrs []string
	srcMiners, srcAddrs, err = _this.ChainRpc.GetMiners(len(fileEnc.Shards), int64(len(fileEnc.Shards[0])))
	if err != nil {
		return
	}
	srcTotal := len(srcMiners)

	// 由于矿工数量可能会小于分片数量，所以需要二次分配
	miners := make([]string, tree.NumLeaves)
	hashes := make([]string, tree.NumLeaves)
	for i := 0; i < tree.NumLeaves; i++ {
		hashes[i] = hex.EncodeToString(tree.Leaves[i])
		miners[i] = srcMiners[i%srcTotal]

		//发送数据到矿工节点
		if err = _this.P2Per.SaveBlockReq(srcAddrs[i%srcTotal], fileEnc.Shards[i], tree.Root, tree.Proofs[i].Siblings, tree.Proofs[i].Path); err != nil {
			ilog.Logger.Error(err)
			return "", err
		}
	}

	// 元数据上链
	hash, err := _this.ChainRpc.UpdMeta(miners, hashes, filepath.Ext(fi.Name()), fi.Size(), int64(len(fileEnc.Shards[0])), fileEnc.DataShards, fileEnc.ParityShards, cid)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	ilog.Logger.Infof("元数据上链：%s", hash)

	// save metadata in leveldb
	enc, err := _this.Serializer.Pack(&Metadata{
		Miners:       miners,
		Hashes:       hashes,
		Ext:          filepath.Ext(fi.Name()),
		Size:         fi.Size(),
		DataShards:   fileEnc.DataShards,
		ParityShards: fileEnc.ParityShards,
	})
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	if err = _this.Storage.Put(nameCid(cid), enc); err != nil {
		ilog.Logger.Error(err)
		return
	}
	return cid, nil
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
	db, err = _this.Storage.Get(nameCid(cid))
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	var meta Metadata
	if err = _this.Serializer.Unpack(db, &meta); err != nil {
		ilog.Logger.Error(err)
		return
	}

	task := len(meta.Hashes)
	//find address:multiAddr
	var miners map[string]string
	miners, err = _this.ChainRpc.FindMultiAddr(removeRepeat(meta.Miners))
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	// todo find chain
	blocks := make([][]byte, meta.DataShards+meta.ParityShards)
	locker := sync.Mutex{}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	wg := sync.WaitGroup{}
	wg.Add(task)
	for i := 0; i < task; i++ {
		go func(i int, miner, hash string) {
			defer ihelp.ErrCatch()
			defer wg.Done()

			if _, ok := miners[meta.Miners[i]]; !ok {
				ilog.Logger.Errorf("can not find miner %s", miners[meta.Miners[i]])
				return
			}

			var block []byte
			block, err = _this.P2Per.FindBlockReq(ctx, miners[meta.Miners[i]], meta.Hashes[i])
			if err != nil {
				return
			}
			locker.Lock()
			blocks[i] = block
			locker.Unlock()
		}(i, meta.Miners[i], meta.Hashes[i])
	}
	wg.Wait()

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
