package common

type ChainRpc interface {
	NodeKind(address string) (role int, err error)
	StoreProofTask() (hashes []string, err error)
	StoreProof(srcData, signature []byte) error
}
