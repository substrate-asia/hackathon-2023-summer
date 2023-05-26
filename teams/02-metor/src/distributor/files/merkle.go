package files

import (
	"github.com/samirshao/itools/ilog"
	mt "github.com/txaty/go-merkletree"
)

type chunkData struct {
	data []byte
}

func (t *chunkData) Serialize() ([]byte, error) {
	return t.data, nil
}

func NewMerkle(data [][]byte) (*mt.MerkleTree, error) {
	blocks := make([]mt.DataBlock, len(data))
	for i := range data {
		blocks[i] = &chunkData{data: data[i]}
	}
	tree, err := mt.New(nil, blocks)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return tree, nil
}
