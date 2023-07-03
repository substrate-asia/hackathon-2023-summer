package cmd

import (
	"MatrixAI-Client/logs"
	"MatrixAI-Client/utils"
	"fmt"
	"github.com/urfave/cli"
	"log"
	"os"
)

var DatasetsCommand = cli.Command{
	Name:  "datasets",
	Usage: "Upload or download a dataset of AI models.",
	Subcommands: []cli.Command{
		{
			Name:  "download",
			Usage: "Download the dataset of the AI model.",
			Flags: []cli.Flag{
				&cli.StringFlag{
					Name:     "url, u",
					Required: true,
					Usage:    "Source of the dataset.",
				},
			},
			Action: func(c *cli.Context) error {

				url := c.String("url")
				logs.Result(fmt.Sprintf("url: %v", url))

				url = utils.EnsureHttps(url)

				err := utils.DownloadAndRenameFile(url, "./datasets/", "./datasets/datasets.zip")
				if err != nil {
					log.Fatalf("Failed to download and rename the file: %v", err)
					return err
				}

				logs.Result("Download and rename the file successfully")

				_, err = utils.Unzip("./datasets/datasets.zip", "./datasets")
				if err != nil {
					log.Fatalf("Failed to unzip the file: %v", err)
					return err
				}

				err = os.Remove("./datasets/datasets.zip")
				if err != nil {
					log.Fatalf("Failed to delete the zip file: %v", err)
				}

				logs.Result("Unzip the file successfully")

				return nil
			},
		},
	},
}
