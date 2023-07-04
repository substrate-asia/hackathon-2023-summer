package config

type Config struct {
	Mnemonic string
	ChainRPC string
	ChainID  int
}

func NewConfig(mnemonic string, chainRPC string, chainID int) *Config {
	return &Config{
		Mnemonic: mnemonic,
		ChainRPC: chainRPC,
		ChainID:  chainID,
	}
}
