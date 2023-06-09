package p2p

import (
	"sync"
)

type PeerKind int

type PeerAttr struct {
	Kind      PeerKind
	MultiAddr string
}

type PeerStore struct {
	Store *sync.Map
}

func NewPeerStore() *PeerStore {
	return &PeerStore{Store: new(sync.Map)}
}

func (_this *PeerStore) Put(pubKey string, attr *PeerAttr) {
	_this.Store.Store(pubKey, attr)
}

func (_this *PeerStore) Get(pubkey string) (*PeerAttr, bool) {
	value, ok := _this.Store.Load(pubkey)
	if !ok {
		return nil, false
	}
	return value.(*PeerAttr), true
}

func (_this *PeerStore) Has(pubkey string) bool {
	_, ok := _this.Store.Load(pubkey)
	return ok
}

func (_this *PeerStore) Delete(pubkey string) {
	_this.Store.Delete(pubkey)
}
