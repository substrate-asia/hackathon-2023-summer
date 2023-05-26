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
	node := &command.App{
		Version: Version,
		Config:  config.NewConfig(),
		Account: new(chain.Evm),
	}
	node.Run()
}
