package main

import (
	"github.com/samirshao/itools/ilog"
	"metor-distributor/command"
	"metor-distributor/config"
)

func init() {
	ilog.Init(false, ilog.InfoLevel, "")
}

func main() {
	config.NewConfig()
	command.NewCommand()
}
