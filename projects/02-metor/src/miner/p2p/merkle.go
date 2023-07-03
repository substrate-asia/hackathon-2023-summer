package p2p

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

func VerifyMerkle(cid, block []byte, siblings [][]byte, path uint32) bool {
	ok, err := mt.Verify(&chunkData{data: block}, &mt.Proof{Siblings: siblings, Path: path}, cid, nil)
	if err != nil {
		ilog.Logger.Error(err)
		return false
	}
	return ok
}
