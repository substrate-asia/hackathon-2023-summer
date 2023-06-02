package common

type Account interface {
	//生成钱包
	Wallet() error
	//质押
	Stake() error
	//解析钱包
	DecKeystore(keystorePath, keystorePassword string) error
	//签名
	Sign(data []byte) (signature []byte, err error)
	//验签
	VerifySign(data, signature []byte) (pubKey string, err error)
	//根据钱包地址查询节点类型 1=distributor 2=miner 3=validator
	NodeKind(wallet string) (kind int, err error)
	//读取钱包地址
	GetAddress() string
	//元数据上链
	StoreMeta(miner map[string][]string, distributor map[string][]map[string]string) (string, error)
	//读取矿工
	GetMiners(count int, filesize int64) ([]string, error)
}
