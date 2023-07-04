package command

import (
	"fmt"
	"github.com/samirshao/itools/icmd"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
	"metor-miner/common"
	"metor-miner/config"
	"runtime"
	"strings"
	"time"
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
			Short: "pledge storage space",
			Long:  `after the pledge is completed, this allows you to become a storage node`,
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
	fmt.Printf("default keystore path is %s , You can specify it with --keystore, whether to continue to use it [Y/N]\n", keystore)
BACK:
	var state string
	n, _ := fmt.Scanln(&state)
	if n == 0 {
		ilog.Logger.Error("please enter Y or N")
		goto BACK
	}

	switch state {
	case "Y", "y":
		_ = _this.Account.Wallet(keystore)
	case "N", "n":
		fmt.Println("create wallet stopped")
		return
	default:
		fmt.Println("please enter Y or N")
		goto BACK
	}
}

func (_this *CmdAccount) Stake(cmd *cobra.Command, args []string) {
	_ = _this.Account.DecKeystore(keystore, password)

BACK:
	fmt.Print("please enter the stake space size, unit [G]：")
	var space string
	n, err := fmt.Scanln(&space)
	if n == 0 || err != nil {
		ilog.Logger.Error("please enter space")
		goto BACK
	}

	intSpace := cast.ToInt64(space)
	if intSpace == 0 {
		ilog.Logger.Error("input error")
		goto BACK
	}

	// create store dir
	blockDir := config.Api.Home + "blocks"
	_ = ifile.MakeDir(blockDir)

	switch runtime.GOOS {
	case "linux":
		img := config.Api.Home + "block.img"
		if _, err = icmd.Exec(fmt.Sprintf("dd if=/dev/zero of=%s bs=%sG count=1", img, space)); err != nil {
			ilog.Logger.Error(err)
			return
		}
		var loopStr string
		loopStr, err = icmd.Exec("losetup -f")
		if err != nil {
			ilog.Logger.Error(err)
			return
		}
		loop := strings.Split(loopStr, "\n")[0]
		if _, err = icmd.Exec(fmt.Sprintf("losetup %s %s", loop, img)); err != nil {
			ilog.Logger.Error(err)
			return
		}
		if _, err = icmd.Exec(fmt.Sprintf("mkfs.ext4 %s", loop)); err != nil {
			ilog.Logger.Error(err)
			return
		}
		if _, err = icmd.Exec(fmt.Sprintf("mount %s %s", loop, blockDir)); err != nil {
			ilog.Logger.Error(err)
			return
		}
	case "darwin":

	}

	if _, err = _this.Account.ApproveToken(intSpace); err != nil {
		return
	}

	time.Sleep(time.Second * 10)

	var state bool
	if state, err = _this.Account.MinerStake(intSpace); err != nil {
		ilog.Logger.Error(err)
		return
	}

	if state {
		fmt.Println("success")
	} else {
		fmt.Println("failed")
	}
}
