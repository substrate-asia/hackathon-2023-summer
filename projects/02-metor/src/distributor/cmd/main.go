package main

import (
	"github.com/samirshao/itools/ilog"
	"metor-distributor/chain"
	"metor-distributor/command"
	"metor-distributor/config"
)

var Version string

func init() {
	ilog.Init(false, ilog.InfoLevel, "")
}

func main() {
	config.NewConfig()
	node := &command.App{
		Version: Version,
		Account: new(chain.Evm),
	}
	node.Run()
}
