package main

import (
	"github.com/samirshao/itools/ilog"
	"metor-chain/command"
	"metor-chain/config"
)

func init() {
	ilog.Init(false, ilog.InfoLevel, "")
}

func main() {
	config.NewConfig()
	command.NewCommand()
}
