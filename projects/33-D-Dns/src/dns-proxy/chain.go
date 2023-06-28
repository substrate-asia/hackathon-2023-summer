package main

import (
	"encoding/hex"
	"log"
	"strings"
	"time"

	gsrpc "github.com/centrifuge/go-substrate-rpc-client/v4"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types/codec"
)

func GetLatestRecords(url string) map[string]string {
	api, err := gsrpc.NewSubstrateAPI(url)
	if err != nil {
		log.Fatal(err)
	}

	dns_storage_key, _ := hex.DecodeString("33ae648c614f3e8c8adca8fa4e7fa72e54c873038096533e074aafb7a78b24ad")

	keys, err := api.RPC.State.GetKeysLatest(dns_storage_key)
	if err != nil {
		log.Fatal(err)
	}

	m := make(map[string]string)
	for _, dns_key := range keys {
		var addr_ip string
		ok, _ := api.RPC.State.GetStorageLatest(dns_key, &addr_ip)
		if ok {
			parts := strings.SplitN(addr_ip, "\n", 2)
			m[parts[0]] = parts[1]
		}
	}
	return m
}

func ChianWorking(url string, rchain chan<- RecordOp) {
	for {
		err := ChainClientStart(url, rchain)
		log.Println(err)
		time.Sleep(5 * time.Second)
	}
}

func ChainClientStart(url string, rchain chan<- RecordOp) error {
	api, err := gsrpc.NewSubstrateAPI(url)
	if err != nil {
		return err
	}

	meta, err := api.RPC.State.GetMetadataLatest()
	if err != nil {
		return err
	}

	// Subscribe to system events via storage
	key, err := types.CreateStorageKey(meta, "System", "Events", nil)
	if err != nil {
		return err
	}

	sub, err := api.RPC.State.SubscribeStorageRaw([]types.StorageKey{key})
	if err != nil {
		return err
	}
	defer sub.Unsubscribe()

	// outer for loop for subscription notifications
	for {
		select {
		case set := <-sub.Chan():
			for _, chng := range set.Changes {
				if !codec.Eq(chng.StorageKey, key) || !chng.HasStorageData {
					continue
				}

				events := MyEvent{}
				err = types.EventRecordsRaw(chng.StorageData).DecodeEventRecords(meta, &events)
				if err != nil {
					return err
				}

				for _, e := range events.DepDns_DnsRecord {
					log.Println(e.Name, e.Value)
					if e.RecordType == 1 {
						op := RecordOp{
							Flag:    true,
							Address: e.Name,
							Ip:      e.Value,
						}
						rchain <- op
					}
				}

				for _, e := range events.DepDns_DnsRecordRemoved {
					if e.RecordType == 1 {
						op := RecordOp{
							Flag:    false,
							Address: e.Name,
						}
						rchain <- op
					}
				}
				for _, e := range events.DepDns_CancelDomain {
					op := RecordOp{
						Flag:    false,
						Address: e.Name,
					}
					rchain <- op
				}
			}
		case err := <-sub.Err():
			{
				return err
			}
		}

	}

}
