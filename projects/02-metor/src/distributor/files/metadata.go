package files

type Metadata struct {
	Miners []string
	Hashes []string
	Ext    string
	Size   int64
	//BlockSize                int64
	DataShards, ParityShards int
}
