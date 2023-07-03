package cmd

import (
	"MatrixAI-Client/chain"
	"MatrixAI-Client/chain/pallets"
	"MatrixAI-Client/chain/subscribe"
	"MatrixAI-Client/config"
	client2 "MatrixAI-Client/deep_learning_model/paddlepaddle/client"
	"MatrixAI-Client/logs"
	"MatrixAI-Client/machine_info"
	"MatrixAI-Client/pattern"
	"MatrixAI-Client/utils"
	"context"
	"fmt"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types/codec"
	"github.com/urfave/cli"
	"google.golang.org/grpc"
	"os"
	"os/exec"
	"strconv"
	"time"
)

var ClientCommand = cli.Command{
	Name:  "client",
	Usage: "Starting or terminating a client.",
	Subcommands: []cli.Command{
		{
			Name:  "execute",
			Usage: "Upload hardware configuration and initiate listening events.",
			Flags: []cli.Flag{
				&cli.StringFlag{
					Name:     "mnemonic, m",
					Required: true,
					Usage:    "Mnemonics used to complete transactions",
				},
			},
			Action: func(c *cli.Context) error {
				matrixWrapper, hwInfo, chainInfo, err := getMatrix(c)
				if err != nil {
					logs.Error(err.Error())
					return err
				}

				machine, err := matrixWrapper.GetMachine(*hwInfo)
				if err != nil {
					logs.Error(fmt.Sprintf("Error: %v", err))
					return err
				}

				if machine.Metadata == "" {
					logs.Normal("Machine does not exist")
					hash, err := matrixWrapper.AddMachine(*hwInfo)
					if err != nil {
						logs.Error(fmt.Sprintf("Error block : %v, msg : %v\n", hash, err))
						return err
					}
				} else {
					logs.Normal("Machine already exists")
				}

				cmd := exec.Command("cmd", "/C", "start", "python", "server/paddle_server.py")
				if err := cmd.Start(); err != nil {
					logs.Error(fmt.Sprintf("Failed to start server: %v", err))
					return err
				}
				defer func(Process *os.Process) {
					err := Process.Kill()
					if err != nil {

					}
				}(cmd.Process)

				conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
				if err != nil {
					return err
				}
				defer func(conn *grpc.ClientConn) {
					err := conn.Close()
					if err != nil {

					}
				}(conn)

				for {
					subscribeBlocks := subscribe.NewSubscribeWrapper(chainInfo)
					orderId, orderPlacedMetadata, err := subscribeBlocks.SubscribeEvents(hwInfo)
					if err != nil {
						logs.Error(err.Error())
						return err
					}
					logs.Normal("subscribe done")

					if codec.Eq(orderId, pattern.OrderId{}) {
						logs.Result("Stop the client.")
						return nil
					}

					err = trainingModel(conn, &orderPlacedMetadata)
					if err != nil {
						_, err = matrixWrapper.OrderFailed(orderId, orderPlacedMetadata)
						if err != nil {
							logs.Error(err.Error())
							return err
						}
						logs.Normal("OrderFailed done")
					} else {
						_, err = matrixWrapper.OrderCompleted(orderId, orderPlacedMetadata)
						if err != nil {
							return err
						}
						logs.Normal("OrderCompleted done")
					}

					time.Sleep(1 * time.Second)
				}
			},
		},
		{
			Name:  "stop",
			Usage: "Stop the client.",
			Flags: []cli.Flag{
				&cli.StringFlag{
					Name:     "mnemonic, m",
					Required: true,
					Usage:    "Mnemonics used to complete transactions",
				},
			},
			Action: func(c *cli.Context) error {
				matrixWrapper, hwInfo, _, err := getMatrix(c)
				if err != nil {
					logs.Error(err.Error())
					return err
				}

				hash, err := matrixWrapper.RemoveMachine(*hwInfo)
				if err != nil {
					logs.Error(fmt.Sprintf("Error block : %v, msg : %v\n", hash, err))
					return err
				}
				return nil
			},
		},
	},
}

func trainingModel(conn *grpc.ClientConn, orderPlacedMetadata *pattern.OrderPlacedMetadata) error {
	// ---------- download datasets ----------
	logs.Normal(fmt.Sprintf("Start downloading DataUrl: %v", orderPlacedMetadata.DataUrl))

	url := utils.EnsureHttps(orderPlacedMetadata.DataUrl)
	err := utils.DownloadAndRenameFile(url, pattern.DATASETS_FOLDER+"/", pattern.DATASETS_FOLDER+pattern.ZIP_NAME)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to download and rename the file: %v", err))
		return err
	}
	logs.Normal("Download and rename the file successfully")

	_, err = utils.Unzip(pattern.DATASETS_FOLDER+pattern.ZIP_NAME, pattern.DATASETS_FOLDER)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to unzip the file: %v", err))
		return err
	}

	err = os.Remove(pattern.DATASETS_FOLDER + pattern.ZIP_NAME)
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to delete the zip file: %v", err))
		return err
	}
	logs.Normal("Unzip the file successfully")
	// ---------- download datasets ----------

	// ------- AI model training -------
	client := client2.NewTrainServiceClient(conn)

	req := &client2.Empty{}
	res, err := client.TrainAndPredict(context.Background(), req)
	if err != nil {
		return err
	}

	msg := res.GetMessage()

	logs.Normal(fmt.Sprintf("msg: %v", msg))
	// ------- AI model training -------

	err = utils.Zip("./output/model", "./model.zip")
	if err != nil {
		return err
	}

	orderPlacedMetadata.Evaluate = msg

	// ---------- upload model ----------
	link, err := utils.UploadModel("./model.zip")
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to upload the model: %v", err))
		return err
	}
	orderPlacedMetadata.ModelUrl = link
	orderPlacedMetadata.CompleteTime = strconv.FormatInt(time.Now().Unix(), 10)
	err = os.Remove("./model.zip")
	if err != nil {
		logs.Error(fmt.Sprintf("Failed to delete the zip file: %v", err))
		return err
	}
	// ---------- upload model ----------
	return nil
}

func getMatrix(c *cli.Context) (*pallets.WrapperMatrix, *machine_info.MachineInfo, *chain.InfoChain, error) {
	logs.Result("-------------------- start --------------------")

	mnemonic := c.String("mnemonic")

	hwInfo, err := machine_info.GetMachineInfo()
	if err != nil {
		return nil, nil, nil, fmt.Errorf("error getting hardware info: %v", err)
	}
	logs.Normal(fmt.Sprintf("Hardware Info:\n%+v\n", hwInfo))

	newConfig := config.NewConfig(
		mnemonic,
		pattern.RPC,
		1)

	chainInfo, err := chain.GetChainInfo(newConfig)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("error getting chain info: %v", err)
	}

	return pallets.NewMatrixWrapper(chainInfo), &hwInfo, chainInfo, nil
}
