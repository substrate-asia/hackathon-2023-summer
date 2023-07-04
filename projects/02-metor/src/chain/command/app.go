package command

import (
	"fmt"
	"github.com/fatih/color"
	"github.com/samirshao/itools/icmd"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
	"metor-chain/common"
	"metor-chain/config"
	"metor-chain/p2p"
	"metor-chain/pkg/serialize"
	"metor-chain/rpc"
	"metor-chain/rpc/srv"
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
	command := fmt.Sprintf("ps aux|grep -w '%s' | grep -v 'grep'|awk '{print $2}'", config.Process)
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

	if cast.ToBool(rootMode) {
		config.Api.Bootstrap = []string{}
	}

	_ = _this.Account.DecKeystore(keystore, password)

	color.Green("metor.chain started")

	jobs := []common.Jobs{
		&p2p.Libp2p{
			Account:    _this.Account,
			Serializer: serialize.NewProtobuf(),
		},
		&rpc.Server{
			MatchSrv: &srv.MatchSrv{Account: _this.Account, Serializer: serialize.NewProtobuf()},
		},
	}

	//启动工作组件
	for _, job := range jobs {
		go job.Start()
	}

	ihelp.Quit()
}
