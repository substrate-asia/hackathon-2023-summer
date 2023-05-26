package command

import (
	"fmt"
	"github.com/fatih/color"
	"github.com/samirshao/itools/icmd"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
	"metor-distributor/common"
	"metor-distributor/config"
	"metor-distributor/p2p"
	"metor-distributor/pkg/serialize"
	"metor-distributor/rpc"
	"strings"
)

const (
	logo = `  ____ _____ _     _    _   _ _        _    ____  
 / ___| ____| |   | |  | | | | |      / \  |  _ \ 
| |   |  _| | |   | |  | | | | |     / _ \ | |_) |
| |___| |___| |___| |__| |_| | |___ / ___ \|  _ < 
 \____|_____|_____|_____\___/|_____/_/   \_\_| \_\
                                                  `
)

var (
	//keystore路径
	keystorePath string
	//keystore密码
	keystorePassword string
	//root模式
	rootMode string
)

type App struct {
	// app version
	Version string
	// account obj
	Account common.Account
}

func (_this *App) Run() {
	commands := []*cobra.Command{
		{
			Use:   "version",
			Short: "版本信息",
			Long:  `版本信息`,
			Run:   _this.version,
		},
		{
			Use:   "wallet",
			Short: "生成钱包",
			Long:  `生成钱包`,
			Run:   _this.wallet,
		},
		{
			Use:   "stake",
			Short: "矿工质押",
			Long:  `矿工质押`,
			Run:   _this.stake,
		},
		{
			Use:   "stop",
			Short: "停止矿工",
			Long:  `停止矿工`,
			Run:   _this.stop,
		},
		{
			Use:   "start",
			Short: "启动矿工",
			Long:  `启动矿工`,
			Run:   _this.start,
		},
	}

	cmd := new(cobra.Command)
	cmd.PersistentFlags().StringVarP(&keystorePath, "keystore", "k", config.Core.Home+"keystore", "keystore path")
	cmd.PersistentFlags().StringVarP(&keystorePassword, "password", "p", "", "keystore password")
	cmd.PersistentFlags().StringVarP(&rootMode, "root", "r", "false", "use root mode")
	cmd.AddCommand(commands...)
	cmd.AddCommand(_this.files())
	if err := cmd.Execute(); err != nil {
		ilog.Logger.Error(err)
	}
}

func (_this *App) version(cmd *cobra.Command, args []string) {
	fmt.Printf("cellular-distribute version %s\n", _this.Version)
}

func (_this *App) wallet(cmd *cobra.Command, args []string) {
	_ = _this.Account.Wallet()
}

func (_this *App) stake(cmd *cobra.Command, args []string) {
	_ = _this.Account.Stake()
}

func (_this *App) stop(cmd *cobra.Command, args []string) {
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

func (_this *App) start(cmd *cobra.Command, args []string) {
	//open debug mode
	if len(args) > 0 && args[0] == "debug" {
		ilog.Logger.Infof("open debug mode >>")
		ilog.Init(false, ilog.DebugLevel, "")
	}

	//todo 测试完删除这个根节点模式
	if !cast.ToBool(rootMode) {
		config.Core.P2PHost = []string{}
	}
	// keystore路径和密码 通过tag -k -p带入
	if err := _this.Account.DecKeystore(keystorePath, keystorePassword); err != nil {
		return
	}

	//打印logo
	color.Green(logo)

	jobs := []common.Jobs{
		//p2p服务
		&p2p.Libp2p{
			Account:    _this.Account,
			Serializer: new(serialize.Protobuf),
		},
		//rpc服务
		&rpc.Server{},
	}

	//启动工作组件
	for _, job := range jobs {
		go job.Start()
	}

	ihelp.Quit()
}
