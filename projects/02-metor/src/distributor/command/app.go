package command

import (
	"fmt"
	"github.com/fatih/color"
	"github.com/samirshao/itools/icmd"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cobra"
	"metor-distributor/common"
	"metor-distributor/config"
	"metor-distributor/files"
	"metor-distributor/p2p"
	"metor-distributor/pkg/serialize"
	"metor-distributor/pkg/storages"
	"metor-distributor/rpc"
	"metor-distributor/sdk"
	"strings"
)

type CmdApp struct {
	Account common.Account
}

func (_this *CmdApp) New() []*cobra.Command {
	commands := []*cobra.Command{
		{
			Use:   "version",
			Short: "version information",
			Long:  `version information`,
			Run:   _this.Version,
		},
		{
			Use:   "stop",
			Short: "stop process",
			Long:  `stop process`,
			Run:   _this.Stop,
		},
		{
			Use:   "start",
			Short: "start process",
			Long:  `start process`,
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

	_ = _this.Account.DecKeystore(keystore, password)

	//打印logo
	color.Green("metor.client started")

	p2pJob := &p2p.P2P{
		Serializer: serialize.NewProtobuf(),
		Account:    _this.Account,
	}

	sdkJob := &sdk.Sdk{
		ApiFiles: sdk.ApiFiles{
			Files: &files.Files{
				P2Per:      p2pJob,
				ChainRpc:   rpc.NewChainRpc(_this.Account, serialize.NewProtobuf()),
				Storage:    storages.NewLeveldb(config.Api.Home + config.Api.DataStore),
				Serializer: serialize.NewJson(),
			},
		},
	}
	jobs := []common.Jobs{
		p2pJob, sdkJob,
	}

	//启动工作组件
	for _, job := range jobs {
		go job.Start()
	}

	ihelp.Quit()
}
