package command

import (
	"fmt"
	"github.com/fatih/color"
	"github.com/samirshao/itools/icmd"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cobra"
	"metor-miner/common"
	"metor-miner/config"
	"metor-miner/p2p"
	"metor-miner/pkg/serialize"
	proof "metor-miner/proofs"
	"metor-miner/rpc"
	"strings"
)

type CmdApp struct {
	// account obj
	Account common.Account
}

func (_this *CmdApp) New() []*cobra.Command {
	commands := []*cobra.Command{
		{
			Use:   "version",
			Short: "版本信息",
			Long:  `版本信息`,
			Run:   _this.Version,
		},
		{
			Use:   "stop",
			Short: "停止矿工",
			Long:  `停止矿工`,
			Run:   _this.Stop,
		},
		{
			Use:   "start",
			Short: "启动矿工",
			Long:  `启动矿工`,
			Run:   _this.Start,
		},
	}
	return commands
}

func (_this *CmdApp) Version(cmd *cobra.Command, args []string) {
	fmt.Printf("%s %s %s\n", config.Process, config.GoosArch, color.RedString(config.Version))
}

func (_this *CmdApp) Stop(cmd *cobra.Command, args []string) {
	process := fmt.Sprintf("metor-d start")
	command := fmt.Sprintf("ps aux|grep -w '%s' | grep -v 'grep'|awk '{print $2}'", process)
	pid, err := icmd.Exec(command)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	pid = strings.ReplaceAll(pid, "\n", "")
	if _, err = icmd.Exec(fmt.Sprintf("kill -9 %s", pid)); err != nil {
		ilog.Logger.Error(err)
		return
	}
}

func (_this *CmdApp) Start(cmd *cobra.Command, args []string) {
	//open debug mode
	if len(args) > 0 && args[0] == "debug" {
		ilog.Logger.Infof("open debug mode >>")
		ilog.Init(false, ilog.DebugLevel, "")
	}

	// keystore路径和密码 通过tag -k -p带入
	_ = _this.Account.DecKeystore(keystore, password)

	//打印logo
	color.Green("metor.miner start")

	rpcSrv := rpc.NewChainRpc(_this.Account, serialize.NewProtobuf())
	jobs := []common.Jobs{
		&p2p.P2P{
			ChainRpc:   rpcSrv,
			Account:    _this.Account,
			Serializer: serialize.NewProtobuf(),
		},
		&proof.Proof{
			Serializer: serialize.NewJson(),
			ChainRpc:   rpcSrv,
		},
	}

	//启动工作组件
	for _, job := range jobs {
		go job.Start()
	}

	ihelp.Quit()
}
