package command

import (
	"fmt"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
	"metor-distributor/common"
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
			Use:   "buy",
			Short: "buy space",
			Long:  `buy`,
			Run:   _this.Buy,
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

func (_this *CmdAccount) Buy(cmd *cobra.Command, args []string) {
	_ = _this.Account.DecKeystore(keystore, password)

BACK:
	fmt.Print("Please enter the size of space you want to buy, unit [G]：")
	var space string
	n, err := fmt.Scanln(&space)
	if n == 0 || space == "0" || err != nil {
		ilog.Logger.Error("please enter space")
		goto BACK
	}

	ok, err := _this.Account.BuyStorage(cast.ToInt64(space), 30)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	if ok {
		fmt.Println("buy space success")
	}
}
