package files

import "context"

type ChainRpc interface {
	GetMiners(count int, blockSize int64) (address []string, multiAddr []string, err error)
	UpdMeta(miners, hashes []string, ext string, filesize, blockSize int64, dataShards, parityShards int, cid string) (hash string, err error)
	FindMultiAddr(address []string) (miners map[string]string, err error)
}

type P2Per interface {
	SaveBlockReq(multiAddr string, block []byte, cid []byte, siblings [][]byte, path uint32) error
	FindBlockReq(ctx context.Context, multiAddr, hash string) ([]byte, error)
}
