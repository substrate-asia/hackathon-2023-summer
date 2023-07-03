package common

type Storage interface {
	Put(k string, v []byte) error
	Get(k string) (v []byte, err error)
	Delete(k string) error
	Has(k string) (bool, error)
	Iter(prefix []byte) (k []string, v [][]byte)
}
