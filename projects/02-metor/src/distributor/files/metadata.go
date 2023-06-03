package files

type Block struct {
	Hash  string
	Miner string
}
type Metadata struct {
	Blocks                   []Block
	Ext                      string
	Size                     int64
	DataShards, ParityShards int
}
