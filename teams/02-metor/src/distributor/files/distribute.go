package files

import (
	"fmt"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/common"
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
}

func (_this *Files) Distribute(fpath string) {
	//check file state
	fi := ifile.FileStat(fpath)
	if fi == nil {
		ilog.Logger.Errorf("can not found %s", fpath)
		return
	}
	if fi.IsDir() {
		ilog.Logger.Errorf("not support dir")
		return
	}
	fdata, err := os.ReadFile(fpath)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	// file chunk
	chunks, err := NewEsCode().Split(fdata)
	if err != nil {
		return
	}

	// make merkle tree
	chunkTree, err := NewMerkle(chunks)
	if err != nil {
		return
	}

	// tree to byte and save
	chunkTreeByte, err := _this.Serializer.Pack(chunkTree)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	if err = _this.Storage.Put(hashKey(string(chunkTree.Root)), chunkTreeByte); err != nil {
		ilog.Logger.Error(err)
		return
	}

	//保存分片
	dir := chunkDir + "/" + string(chunkTree.Root)
	if !ifile.IsExist(dir) {
		_ = ifile.MakeDir(dir)
	}
	fname := filepath.Base(fpath)
	for i := range chunks {
		err = os.WriteFile(fmt.Sprintf("%s/%s.%d", dir, fname, i), chunks[i], 0666)
		if err != nil {
			ilog.Logger.Error(err)
			return
		}
	}

}
