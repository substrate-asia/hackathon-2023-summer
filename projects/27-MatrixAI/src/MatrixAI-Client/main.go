package main

import (
	"MatrixAI-Client/cmd"
	"MatrixAI-Client/logs"
	"fmt"
	"go.uber.org/zap"
	"os"
	"runtime"

	"github.com/urfave/cli"
)

var Version = "v0.1.2"

func setupApp() *cli.App {
	app := cli.NewApp()
	app.Name = "MatrixAI-Client"
	app.Usage = "Share your unused computing capacity to provide support for more AI creators in need and earn profits at the same time."
	app.Action = startService
	app.Version = Version
	app.Flags = []cli.Flag{}
	app.Commands = []cli.Command{
		cmd.ClientCommand,
		cmd.DatasetsCommand,
		cmd.PaddleCommand,
	}
	app.Before = func(context *cli.Context) error {
		initLog()
		runtime.GOMAXPROCS(runtime.NumCPU())
		return nil
	}
	return app
}

func main() {
	if err := setupApp().Run(os.Args); err != nil {
		logs.Error(err.Error())
		os.Exit(1)
	}
}

func startService(context *cli.Context) error {
	return nil
}

func initLog() {
	defer func(Logger *zap.Logger) {
		err := Logger.Sync()
		if err != nil {
			fmt.Printf("Error: %v\n", err)
		}
	}(logs.Logger)
}
