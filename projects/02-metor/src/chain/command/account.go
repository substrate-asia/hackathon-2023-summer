package command

import (
	"fmt"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cobra"
	"metor-chain/common"
)

type CmdAccount struct {
	Account common.Account
}

func (_this *CmdAccount) New() []*cobra.Command {
	commands := []*cobra.Command{
		{
			Use:   "wallet",
			Short: "create wallet",
			Long:  `for data signature, space purchase`,
			Run:   _this.Wallet,
		},
		{
			Use:   "stake",
			Short: "validator role",
			Long:  `become a validator role`,
			Run:   _this.Stake,
		},
	}
	cmd := &cobra.Command{
		Use:   "account",
		Short: "wallet operation related",
	}
	cmd.AddCommand(commands...)
	return []*cobra.Command{cmd}
}

func (_this *CmdAccount) Wallet(cmd *cobra.Command, args []string) {
	_ = _this.Account.Wallet(keystore)
}

func (_this *CmdAccount) Stake(cmd *cobra.Command, args []string) {
	_ = _this.Account.DecKeystore(keystore, password)

	fmt.Println("pledge to become a verification node, whether to continue [Y/N]?")
BACK:
	var state string
	n, _ := fmt.Scanln(&state)
	if n == 0 {
		fmt.Println("please enter Y or N")
		goto BACK
	}

	switch state {
	case "Y", "y":
		ok, err := _this.Account.Stake()
		if err != nil {
			ilog.Logger.Error(err)
			return
		}
		if ok {
			fmt.Println("stake success")
		} else {
			fmt.Println("stake failed")
		}
	case "N", "n":
		fmt.Println("stake stopped")
		return
	default:
		fmt.Println("please enter Y or N")
		goto BACK
	}
}
