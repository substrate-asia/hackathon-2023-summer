package main

import (
	"github.com/samirshao/itools/ilog"
	"metor-miner/command"
	"metor-miner/config"
)

func init() {
	ilog.Init(false, ilog.DebugLevel, "")
}

func main() {
	config.NewConfig()
	command.NewCommand()
}
