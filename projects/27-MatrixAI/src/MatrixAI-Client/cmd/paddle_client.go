package cmd

import (
	client2 "MatrixAI-Client/deep_learning_model/paddlepaddle/client"
	"MatrixAI-Client/utils"
	"bytes"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"MatrixAI-Client/logs"
	"context"
	"fmt"
	"github.com/urfave/cli"
	"google.golang.org/grpc"
)

var PaddleCommand = cli.Command{
	Name:  "paddle",
	Usage: "Paddlepaddle client.",
	Subcommands: []cli.Command{
		{
			Name:  "start",
			Usage: "Start paddlepaddle client.",
			//Flags: []cli.Flag{
			//	&cli.StringFlag{
			//		Name:     "mnemonic, m",
			//		Required: true,
			//		Usage:    "Mnemonics used to complete transactions",
			//	},
			//},
			Action: func(c *cli.Context) error {

				logs.Result("start paddle client")

				//mnemonic := c.String("mnemonic")

				cmd := exec.Command("cmd", "/C", "start", "python", "server/paddle_server.py")
				if err := cmd.Start(); err != nil {
					log.Fatalf("Failed to start server: %v", err)
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

				//client := client2.NewPaddleServiceClient(conn)
				//
				//req := &client2.TrainAndEvaluateRequest{
				//	Mnemonics: mnemonic,
				//}
				//res, err := client.TrainAndEvaluate(context.Background(), req)
				//if err != nil {
				//	return err
				//}
				//
				//isSuccess := res.GetSuccess()
				//
				//logs.Normal(fmt.Sprintf("isSuccess: %v", isSuccess))

				client := client2.NewTrainServiceClient(conn)

				req := &client2.Empty{}
				res, err := client.TrainAndPredict(context.Background(), req)
				if err != nil {
					return err
				}

				msg := res.GetMessage()
				imgData := res.GetImageData()
				trueLabel := res.GetTrueLabel()
				predLabel := res.GetPredictedLabel()

				logs.Normal(fmt.Sprintf("msg: %v", msg))
				logs.Normal(fmt.Sprintf("imgData: %v", imgData))
				logs.Normal(fmt.Sprintf("trueLabel: %v", trueLabel))
				logs.Normal(fmt.Sprintf("predLabel: %v", predLabel))

				err = utils.Zip("./server/output/model", "./model.zip")
				if err != nil {
					return err
				}

				if err := cmd.Process.Kill(); err != nil {
					log.Fatalf("Failed to kill process: %v", err)
				}

				url := "https://d.cess.cloud/1688009453371.zip"
				method := "POST"

				payload := &bytes.Buffer{}
				writer := multipart.NewWriter(payload)
				file, err := os.Open("./model.zip")
				if err != nil {
					log.Fatal(err)
				}
				defer func(file *os.File) {
					err := file.Close()
					if err != nil {

					}
				}(file)
				part1,
					err := writer.CreateFormFile("file", filepath.Base(file.Name()))
				if err != nil {
					log.Fatal(err)
				}
				_, err = io.Copy(part1, file)

				err = writer.Close()
				if err != nil {
					log.Fatal(err)
				}

				httpClient := &http.Client{}
				httpReq, err := http.NewRequest(method, url, payload)

				if err != nil {
					log.Fatal(err)
				}
				httpReq.Header.Set("Content-Type", writer.FormDataContentType())
				result, err := httpClient.Do(httpReq)
				if err != nil {
					log.Fatal(err)
				}
				defer func(Body io.ReadCloser) {
					err := Body.Close()
					if err != nil {

					}
				}(result.Body)

				log.Print("Upload finished with status: ", result.Status)

				return nil
			},
		},
	},
}
