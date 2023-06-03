package p2p

import "sync"

type ChanMap struct {
	*sync.Map
}

func NewChanMap() *ChanMap {
	return &ChanMap{new(sync.Map)}
}
