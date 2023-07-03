package command

import (
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cobra"
	"metor-distributor/chain"
	"metor-distributor/config"
)

var (
	keystore string
	password string
	chainRPC string
)

func NewCommand() {
	cmd := new(cobra.Command)
	cmd.PersistentFlags().StringVarP(&keystore, "keystore", "k", config.Api.Home+"keystore", "keystore path")
	cmd.PersistentFlags().StringVarP(&password, "password", "p", "", "keystore password")

	// add sub command
	account := chain.NewEvm()

	commands := []Commander{
		&CmdAccount{Account: account},
		&CmdApp{Account: account},
	}
	for i := range commands {
		cmd.AddCommand(commands[i].New()...)
	}
	if err := cmd.Execute(); err != nil {
		ilog.Logger.Error(err)
	}
}
