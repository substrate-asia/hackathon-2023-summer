package command

import (
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/cobra"
	"metor-distributor/config"
	"metor-distributor/rpc"
)

func (_this *App) files() *cobra.Command {
	sub := []*cobra.Command{
		{
			Use:   "add",
			Short: "Add files to the network",
			Long:  `Add files to network, supporting files or folders`,
			Run:   _this.filesAdd,
		},
		{
			Use:   "get",
			Short: "get files from network",
			Long:  `get files from network can be use cid`,
			Run:   _this.filesGet,
		},
	}

	cmd := &cobra.Command{
		Use:   "files",
		Short: "File operation related",
	}
	cmd.AddCommand(sub...)
	return cmd
}

func (_this *App) filesAdd(cmd *cobra.Command, args []string) {
	if len(args) == 0 {
		ilog.Logger.Error("Please fill in the file path")
		return
	}
	if !ifile.IsExist(args[0]) {
		ilog.Logger.Error("The file path could not be found")
		return
	}
	rpc.NewClient(config.Api.RpcHost).AddFile(args[0])
}

func (_this *App) filesGet(cmd *cobra.Command, args []string) {
	if len(args) == 0 {
		ilog.Logger.Error("Please fill in the cid")
		return
	}
	rpc.NewClient(config.Api.RpcHost).GetFile(args[0])
}
