package subscribe

import (
	"MatrixAI-Client/chain"
	"MatrixAI-Client/chain/events"
	"MatrixAI-Client/logs"
	"MatrixAI-Client/machine_info"
	"MatrixAI-Client/pattern"
	"MatrixAI-Client/utils"
	"encoding/json"
	"fmt"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types/codec"
)

type WrapperSubscribe struct {
	*chain.InfoChain
}

func (chain *WrapperSubscribe) SubscribeEvents(hardwareInfo *machine_info.MachineInfo) (pattern.OrderId, pattern.OrderPlacedMetadata, error) {

	var orderPlacedMetadata pattern.OrderPlacedMetadata

	sub, err := chain.Conn.Api.RPC.State.SubscribeStorageRaw([]types.StorageKey{chain.Conn.KeyEvents})
	if err != nil {
		return pattern.OrderId{}, orderPlacedMetadata, fmt.Errorf("SubscribeStorageRaw error: %v", err)
	}
	defer sub.Unsubscribe()

	for {
		set := <-sub.Chan()

		logs.Normal(fmt.Sprintf("---------- block hash ---------- %v", set.Block.Hex()))

		// inner loop for the changes within one of those notifications
		for _, chng := range set.Changes {
			if !codec.Eq(chng.StorageKey, chain.Conn.KeyEvents) || !chng.HasStorageData {
				// skip, we are only interested in tEvents with content
				continue
			}

			// Decode the event records
			tEvents := events.EventRecords{}
			err = types.EventRecordsRaw(chng.StorageData).DecodeEventRecords(chain.Conn.Metadata, &tEvents)
			if err != nil {
				logs.Error(fmt.Sprintf("DecodeEventRecords error block hash : %v , msg : %v", set.Block.Hex(), err))
				continue
			}

			machineUUID, err := utils.ParseMachineUUID(string(hardwareInfo.MachineUUID))
			if err != nil {
				return pattern.OrderId{}, orderPlacedMetadata, fmt.Errorf("ParseMachineUUID error : %v", err)
			}

			for _, e := range tEvents.HashrateMarket_OrderPlaced {
				logs.Normal(fmt.Sprintf("HashrateMarket:OrderPlaced:: (phase=%#v)", e.Phase))

				err = json.Unmarshal(e.Metadata, &orderPlacedMetadata)
				if err != nil {
					return pattern.OrderId{}, orderPlacedMetadata, fmt.Errorf("json.Unmarshal error : %v", err)
				}

				if codec.Eq(e.MachineId, machineUUID) {
					logs.Result(fmt.Sprintf("Subscribe HashrateMarket_OrderPlaced : %v", set.Block.Hex()))
					return e.OrderId, orderPlacedMetadata, nil
				}
			}

			for _, e := range tEvents.HashrateMarket_MachineRemoved {
				logs.Normal(fmt.Sprintf("HashrateMarket:MachineRemoved:: (phase=%#v)", e.Phase))

				if codec.Eq(e.Id, machineUUID) {
					logs.Result(fmt.Sprintf("Subscribe HashrateMarket_MachineRemoved : %v", set.Block.Hex()))
					return pattern.OrderId{}, orderPlacedMetadata, nil
				}
			}
		}
	}
}

func NewSubscribeWrapper(info *chain.InfoChain) *WrapperSubscribe {
	return &WrapperSubscribe{info}
}
