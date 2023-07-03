package chain

import (
	"encoding/json"
	"github.com/Dreamacro/clash/component/trie"
	"github.com/go-resty/resty/v2"
)

const URLBASE = "https://d-dns-proxy.deeper.network"

var Hosts = trie.New()

type RecordRequest struct {
	Address string `json:"address"`
}

type RecordReponse struct {
	Ip string `json:"ip"`
}

type VersionResponse struct {
	Version uint64 `json:"version"`
}

type Record struct {
	Address string `json:"address"`
	Ip      string `json:"ip"`
}

type SnapshotResponse struct {
	Version uint64   `json:"version"`
	Records []Record `json:"records"`
}

func GetVersion() (uint64, error) {
	client := resty.New()
	resp, err := client.R().Get(URLBASE + "/version")
	if err != nil {
		return 0, err
	}
	var versionResponse VersionResponse
	err = json.Unmarshal(resp.Body(), &versionResponse)
	if err != nil {
		return 0, err
	}
	return versionResponse.Version, nil
}

func GetSnapshot() ([]Record, error) {
	client := resty.New()
	resp, err := client.R().Get(URLBASE + "/snapshot")
	if err != nil {
		return nil, err
	}
	var snapshotResponse SnapshotResponse
	err = json.Unmarshal(resp.Body(), &snapshotResponse)
	if err != nil {
		return nil, err
	}
	return snapshotResponse.Records, nil
}

func QueryRecord(address string) error {
	client := resty.New()
	resp, err := client.R().SetBody(RecordRequest{Address: address}).Post(URLBASE + "/query")
	if err != nil {
		return err
	}
	var recordResponse RecordReponse
	err = json.Unmarshal(resp.Body(), &recordResponse)
	if err != nil {
		return err
	}
	Hosts.Insert(address, recordResponse.Ip)
	return nil
}

var Version uint64 = 0
