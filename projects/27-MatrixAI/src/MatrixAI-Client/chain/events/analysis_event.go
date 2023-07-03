package events

import (
	"MatrixAI-Client/chain"
	"fmt"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
)

type WrapperAnalysis struct {
	*chain.InfoChain
}

func (chain *WrapperAnalysis) AnalysisEvents(blockHashes <-chan types.Hash, quitChan chan<- struct{}) {
	for hash := range blockHashes {
		//parentHash, _ := codec.EncodeToHex(hash)
		//fmt.Println("Processing block:", parentHash)

		events := EventRecords{}
		h, err := chain.Conn.Api.RPC.State.GetStorageRaw(chain.Conn.KeyEvents, hash)

		fmt.Printf("GetStorageRaw ： %v\n", h)

		if err != nil {
			_ = fmt.Errorf("GetStorageRaw error: %v", err)

			fmt.Println("1111111111111111111")

			return
		}
		err = types.EventRecordsRaw(*h).DecodeEventRecords(chain.Conn.Metadata, &events)
		if err != nil {
			fmt.Printf("DecodeEventRecords error: %v\n", err)

			fmt.Println("22222222222222222222")

			return
		}

		fmt.Printf("HashrateMarket_OrderPlaced len : %v\n", len(events.HashrateMarket_OrderPlaced))
		if len(events.HashrateMarket_OrderPlaced) > 0 {
			acc := events.HashrateMarket_OrderPlaced[0].Buyer
			fmt.Println("解析到事件，通知主循环停止订阅", acc)
			close(quitChan) // 通知主循环停止订阅

			fmt.Println("33333333333333333333")

			return
		}

		fmt.Println("------ AnalysisEvents once ------")
	}
}

func NewAnalysisWrapper(info *chain.InfoChain) *WrapperAnalysis {
	return &WrapperAnalysis{info}
}
