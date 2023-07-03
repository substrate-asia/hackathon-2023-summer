package main

import (
	"ddns/chain"
	"ddns/clashdns"
	"github.com/Dreamacro/clash/log"
	"net"
	"time"
)

var (
	defaultDNS = []clashdns.NameServer{
		{
			Addr: "114.114.114.114:53",
		},
	}
	snapshotUpdateInterval = 60 * time.Minute
	bindingAddress         = "0.0.0.0:53"
)

func main() {
	for {
		log.Infoln("Getting version...")
		version, err := chain.GetVersion()
		if err != nil {
			panic(err)
		}
		log.Infoln("Version: %d vs %d\n", version, chain.Version)
		if version != chain.Version {
			log.Infoln("Getting snapshot...")
			snapshot, err := chain.GetSnapshot()
			if err != nil {
				panic(err)
			}
			log.Infoln("Building trie...", snapshot)
			for _, record := range snapshot {
				chain.Hosts.Insert(record.Address, net.ParseIP(record.Ip))
			}
			cfg := clashdns.Config{
				Hosts:    chain.Hosts,
				Main:     defaultDNS,
				Fallback: defaultDNS,
				Default:  defaultDNS,
			}
			resolver := clashdns.NewResolver(cfg)
			mapper := clashdns.NewEnhancer(cfg)
			clashdns.ReCreateServer(bindingAddress, resolver, mapper)
		}
		time.Sleep(snapshotUpdateInterval)
	}
}
