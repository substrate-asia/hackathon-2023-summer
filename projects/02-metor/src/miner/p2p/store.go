package p2p

import (
	"sync"
)

//type PeerKind int
//
//type PeerAttr struct {
//	Kind      PeerKind
//	MultiAddr string
//}

type PeerStore struct {
	Store *sync.Map
}

func NewPeerStore() *PeerStore {
	return &PeerStore{Store: new(sync.Map)}
}

func (_this *PeerStore) Put(pubKey string, multiAddr string) {
	_this.Store.Store(pubKey, multiAddr)
}

func (_this *PeerStore) Get(pubkey string) (multiAddr string, ok bool) {
	var value any
	value, ok = _this.Store.Load(pubkey)
	if !ok {
		return "", false
	}
	return value.(string), true
}

func (_this *PeerStore) Has(pubkey string) bool {
	_, ok := _this.Store.Load(pubkey)
	return ok
}

func (_this *PeerStore) Delete(pubkey string) {
	_this.Store.Delete(pubkey)
}
