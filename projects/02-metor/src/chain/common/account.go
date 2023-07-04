package common

type Account interface {
	DecKeystore(keystorePath, keystorePwd string) error
	Wallet(keystorePath string) error
	Sign(data []byte) (signature []byte, err error)
	VerifySign(data, signature []byte) (pubKey string, err error)
	GetAddress() string
	GetAddressListByFunc(funcName string) ([]string, error)
	UploadMetaData(miners, fileHash []string, ext, cid, user string, size, blockSize int64, dataShards, parityShards int) (TxHash string, err error)
	NodeKind(address string) (int, error)
	Stake() (bool, error)
	ApproveToken(amount int64) (bool, error)
}
