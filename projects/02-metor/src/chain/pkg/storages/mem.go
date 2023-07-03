package storages

import "sync"

type Mem struct {
	Db *sync.Map
}

func NewMem() *Mem {
	return &Mem{Db: new(sync.Map)}
}

func (_this *Mem) Put(k string, v []byte) error {
	_this.Db.Store(k, v)
	return nil
}

func (_this *Mem) Get(k string) ([]byte, error) {
	v, ok := _this.Db.Load(k)
	if ok {
		return v.([]byte), nil
	}
	return nil, nil
}

func (_this *Mem) Delete(k string) error {
	_this.Db.Delete(k)
	return nil
}

func (_this *Mem) Has(k string) (bool, error) {
	_, ok := _this.Db.Load(k)
	if ok {
		return true, nil
	}
	return false, nil
}

func (_this *Mem) Iter(prefix []byte) (k []string, v [][]byte) {
	_this.Db.Range(func(key, value any) bool {
		k = append(k, key.(string))
		v = append(v, value.([]byte))
		return true
	})
	return
}
