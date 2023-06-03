package chain

type distrData struct {
	ChunkHash []string
	Miner     []string
}

func (_this *Evm) StoreMeta(miner map[string][]string, distributor map[string][]map[string]string) (string, error) {
	return "", nil
}
