package storages

import (
	"github.com/samirshao/itools/ilog"
	"github.com/syndtr/goleveldb/leveldb"
	"github.com/syndtr/goleveldb/leveldb/util"
)

type Level struct {
	Db *leveldb.DB
}

func NewLeveldb(dbPath string) *Level {
	db, err := leveldb.OpenFile(dbPath, nil)
	if err != nil {
		ilog.Logger.Fatalln(err)
	}

	ilog.Logger.Infof("datastore initialize success")
	return &Level{Db: db}
}

func (_this *Level) Put(k string, v []byte) error {
	if err := _this.Db.Put([]byte(k), v, nil); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	return nil
}

func (_this *Level) Get(k string) ([]byte, error) {
	v, err := _this.Db.Get([]byte(k), nil)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return v, nil
}

func (_this *Level) Delete(k string) error {
	if err := _this.Db.Delete([]byte(k), nil); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	return nil
}

func (_this *Level) Has(k string) (bool, error) {
	return _this.Db.Has([]byte(k), nil)
}

// 查找过期
func (_this *Level) Iter(prefix []byte) (k []string, v [][]byte) {
	if prefix == nil {
		prefix = []byte("")
	}
	iter := _this.Db.NewIterator(util.BytesPrefix(prefix), nil)
	// 如果迭代器还有下一个内容，继续遍历
	for iter.Next() {
		k = append(k, string(iter.Key()))
		v = append(v, iter.Value())
	}
	// 释放迭代器
	iter.Release()
	return
}
