package common

type Account interface {
	//生成钱包
	Wallet(keystorePath string) error
	//矿工质押
	MinerStake(space int64) (bool, error)
	//解析钱包
	DecKeystore(keystorePath, keystorePwd string) error
	//签名
	Sign(data []byte) (signature []byte, err error)
	//验签
	VerifySign(data, signature []byte) (pubKey string, err error)
	//根据钱包地址查询节点类型 1=distributor 2=miner 3=validator
	//NodeKind(wallet string) (kind int, err error)
	//读取钱包地址
	GetAddress() string
	// ApproveToken
	ApproveToken(amount int64) (bool, error)
}
