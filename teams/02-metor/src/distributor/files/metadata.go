package files

import "github.com/txaty/go-merkletree"

type Meta struct {
	Ext  string
	Size int64
}

type Metadata struct {
	Tree  *merkletree.MerkleTree
	Miner []string
	Meta  Meta
}
