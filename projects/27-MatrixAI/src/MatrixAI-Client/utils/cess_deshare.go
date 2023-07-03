package utils

import (
	"bytes"
	"encoding/json"
	"github.com/cavaliergopher/grab/v3"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

func DownloadAndRenameFile(url string, destFolder string, renameTo string) error {
	client := grab.NewClient()
	req, _ := grab.NewRequest(destFolder, url)

	resp := client.Do(req)
	if err := resp.Err(); err != nil {
		return err
	}

	err := os.Rename(resp.Filename, renameTo)
	if err != nil {
		return err
	}

	return nil
}

type Response struct {
	Link string `json:"link"`
}

func UploadModel(dest string) (string, error) {
	formatInt := strconv.FormatInt(time.Now().Unix(), 10)
	url := "https://d.cess.cloud/" + formatInt + ".zip"
	method := "POST"

	payload := &bytes.Buffer{}
	writer := multipart.NewWriter(payload)
	file, err := os.Open(dest)
	if err != nil {
		return "", err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)
	part1,
		err := writer.CreateFormFile("file", filepath.Base(file.Name()))
	if err != nil {
		return "", err
	}
	_, err = io.Copy(part1, file)

	err = writer.Close()
	if err != nil {
		return "", err
	}

	httpClient := &http.Client{}
	httpReq, err := http.NewRequest(method, url, payload)

	if err != nil {
		return "", err
	}
	httpReq.Header.Set("Content-Type", writer.FormDataContentType())
	result, err := httpClient.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(result.Body)

	var resp Response
	err = json.NewDecoder(result.Body).Decode(&resp)
	if err != nil {
		return "", err
	}

	log.Print("Upload finished with status: ", result.Status)
	return resp.Link, err
}
