package common

type Account interface {
	//生成钱包
	Wallet(keystorePath string) error
	//解析钱包
	DecKeystore(keystorePath, keystorePwd string) error
	//签名
	Sign(data []byte) (signature []byte, err error)
	//验签
	VerifySign(data, signature []byte) (pubKey string, err error)
	//读取钱包地址
	GetAddress() string
	//购买空间
	BuyStorage(store, days int64) (bool, error)
}
