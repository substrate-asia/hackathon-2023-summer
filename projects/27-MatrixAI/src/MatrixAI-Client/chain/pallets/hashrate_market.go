package pallets

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
	"github.com/pkg/errors"
	"time"
)

type WrapperMatrix struct {
	*chain.InfoChain
}

func (chain WrapperMatrix) AddMachine(hardwareInfo machine_info.MachineInfo) (string, error) {
	logs.Normal(fmt.Sprintf("Extrinsic : %v", pattern.TX_HASHRATE_MARKET_REGISTER))

	var (
		txhash      string
		accountInfo types.AccountInfo
	)

	machineUUID, err := utils.ParseMachineUUID(string(hardwareInfo.MachineUUID))
	if err != nil {
		return txhash, fmt.Errorf("error parsing uuid: %v", err)
	}

	jsonData, err := json.Marshal(hardwareInfo)
	if err != nil {
		return txhash, fmt.Errorf("error marshaling the struct to JSON: %v", err)
	}

	err = chain.GetNonce(&accountInfo)
	if err != nil {
		return txhash, fmt.Errorf("error getting nonce: %v", err)
	}

	call, err := types.NewCall(chain.Conn.Metadata, pattern.TX_HASHRATE_MARKET_REGISTER, machineUUID, types.NewBytes(jsonData))
	if err != nil {
		return txhash, fmt.Errorf("error creating call: %v", err)
	}

	ext, err := chain.GetSign(accountInfo, call)
	if err != nil {
		return txhash, fmt.Errorf("error getting sign: %v", err)
	}

	sub, err := chain.Conn.Api.RPC.Author.SubmitAndWatchExtrinsic(ext)
	if err != nil {
		return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
	}

	defer sub.Unsubscribe()

	timeout := time.NewTimer(time.Second * time.Duration(12))
	defer timeout.Stop()

	for {
		select {
		case status := <-sub.Chan():
			if status.IsInBlock {
				logs.Result(fmt.Sprintf("------------------ Extrinsic completed ------------------ : %#x", status.AsInBlock))

				tEvents := events.EventRecords{}
				txhash, _ = codec.EncodeToHex(status.AsInBlock)
				h, err := chain.Conn.Api.RPC.State.GetStorageRaw(chain.Conn.KeyEvents, status.AsInBlock)
				if err != nil {
					return txhash, fmt.Errorf("error getting storage raw: %v", err)
				}

				err = types.EventRecordsRaw(*h).DecodeEventRecords(chain.Conn.Metadata, &tEvents)
				if err != nil {
					return txhash, fmt.Errorf("DecodeEventRecords error : %v", err)
				}

				for _, e := range tEvents.HashrateMarket_MachineAdded {
					if codec.Eq(e.Id, machineUUID) {
						logs.Result("add machine bingo!!!")
						return txhash, nil
					}
				}
				return txhash, errors.New(pattern.ERR_Failed)
			}
		case err = <-sub.Err():
			return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
		case <-timeout.C:
			return txhash, errors.New(pattern.ERR_Timeout)
		}
	}
}

func (chain WrapperMatrix) OrderCompleted(orderId pattern.OrderId, orderPlacedMetadata pattern.OrderPlacedMetadata) (string, error) {
	logs.Normal(fmt.Sprintf("Extrinsic : %v", pattern.TX_HASHRATE_MARKET_ORDER_COMPLETED))

	var (
		txhash      string
		accountInfo types.AccountInfo
	)

	jsonData, err := json.Marshal(orderPlacedMetadata)
	if err != nil {
		return txhash, fmt.Errorf("error marshaling the struct to JSON: %v", err)
	}

	err = chain.GetNonce(&accountInfo)
	if err != nil {
		return txhash, fmt.Errorf("error getting nonce: %v", err)
	}

	call, err := types.NewCall(chain.Conn.Metadata, pattern.TX_HASHRATE_MARKET_ORDER_COMPLETED, orderId, types.NewBytes(jsonData))
	if err != nil {
		return txhash, fmt.Errorf("error creating call: %v", err)
	}

	ext, err := chain.GetSign(accountInfo, call)
	if err != nil {
		return txhash, fmt.Errorf("error getting sign: %v", err)
	}

	sub, err := chain.Conn.Api.RPC.Author.SubmitAndWatchExtrinsic(ext)
	if err != nil {
		return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
	}

	defer sub.Unsubscribe()

	timeout := time.NewTimer(time.Second * time.Duration(12))
	defer timeout.Stop()

	for {
		select {
		case status := <-sub.Chan():
			if status.IsInBlock {
				logs.Result(fmt.Sprintf("------------------ Extrinsic completed ------------------ : %#x", status.AsInBlock))

				tEvents := events.EventRecords{}
				txhash, _ = codec.EncodeToHex(status.AsInBlock)
				h, err := chain.Conn.Api.RPC.State.GetStorageRaw(chain.Conn.KeyEvents, status.AsInBlock)
				if err != nil {
					return txhash, fmt.Errorf("error getting storage raw: %v", err)
				}

				err = types.EventRecordsRaw(*h).DecodeEventRecords(chain.Conn.Metadata, &tEvents)
				if err != nil {
					return txhash, fmt.Errorf("DecodeEventRecords error : %v", err)
				}

				for _, e := range tEvents.HashrateMarket_OrderCompleted {
					if codec.Eq(e.OrderId, orderId) {
						logs.Result("order completed bingo!!!")
						return txhash, nil
					}
				}
				return txhash, errors.New(pattern.ERR_Failed)
			}
		case err = <-sub.Err():
			return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
		case <-timeout.C:
			return txhash, errors.New(pattern.ERR_Timeout)
		}
	}
}

func (chain WrapperMatrix) OrderFailed(orderId pattern.OrderId, orderPlacedMetadata pattern.OrderPlacedMetadata) (string, error) {
	logs.Normal(fmt.Sprintf("Extrinsic : %v", pattern.TX_HASHRATE_MARKET_ORDER_FAILED))

	var (
		txhash      string
		accountInfo types.AccountInfo
	)

	jsonData, err := json.Marshal(orderPlacedMetadata)
	if err != nil {
		return txhash, fmt.Errorf("error marshaling the struct to JSON: %v", err)
	}

	err = chain.GetNonce(&accountInfo)
	if err != nil {
		return txhash, fmt.Errorf("error getting nonce: %v", err)
	}

	call, err := types.NewCall(chain.Conn.Metadata, pattern.TX_HASHRATE_MARKET_ORDER_FAILED, orderId, types.NewBytes(jsonData))
	if err != nil {
		return txhash, fmt.Errorf("error creating call: %v", err)
	}

	ext, err := chain.GetSign(accountInfo, call)
	if err != nil {
		return txhash, fmt.Errorf("error getting sign: %v", err)
	}

	sub, err := chain.Conn.Api.RPC.Author.SubmitAndWatchExtrinsic(ext)
	if err != nil {
		return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
	}

	defer sub.Unsubscribe()

	timeout := time.NewTimer(time.Second * time.Duration(12))
	defer timeout.Stop()

	for {
		select {
		case status := <-sub.Chan():
			if status.IsInBlock {
				logs.Result(fmt.Sprintf("------------------ Extrinsic completed ------------------ : %#x", status.AsInBlock))

				tEvents := events.EventRecords{}
				txhash, _ = codec.EncodeToHex(status.AsInBlock)
				h, err := chain.Conn.Api.RPC.State.GetStorageRaw(chain.Conn.KeyEvents, status.AsInBlock)
				if err != nil {
					return txhash, fmt.Errorf("error getting storage raw: %v", err)
				}

				err = types.EventRecordsRaw(*h).DecodeEventRecords(chain.Conn.Metadata, &tEvents)
				if err != nil {
					return txhash, fmt.Errorf("DecodeEventRecords error : %v", err)
				}

				for _, e := range tEvents.HashrateMarket_OrderFailed {
					if codec.Eq(e.OrderId, orderId) {
						logs.Result("order failed bingo!!!")
						return txhash, nil
					}
				}
				return txhash, errors.New(pattern.ERR_Failed)
			}
		case err = <-sub.Err():
			return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
		case <-timeout.C:
			return txhash, errors.New(pattern.ERR_Timeout)
		}
	}
}

func (chain WrapperMatrix) RemoveMachine(hardwareInfo machine_info.MachineInfo) (string, error) {
	logs.Normal(fmt.Sprintf("Extrinsic : %s", pattern.TX_HASHRATE_MARKET_REMOVE_MACHINE))

	var (
		txhash      string
		accountInfo types.AccountInfo
	)

	machineUUID, err := utils.ParseMachineUUID(string(hardwareInfo.MachineUUID))
	if err != nil {
		return txhash, fmt.Errorf("error parsing uuid: %v", err)
	}

	err = chain.GetNonce(&accountInfo)
	if err != nil {
		return txhash, fmt.Errorf("error getting nonce: %v", err)
	}

	call, err := types.NewCall(chain.Conn.Metadata, pattern.TX_HASHRATE_MARKET_REMOVE_MACHINE, machineUUID)
	if err != nil {
		return txhash, fmt.Errorf("error creating call: %v", err)
	}

	ext, err := chain.GetSign(accountInfo, call)
	if err != nil {
		return txhash, fmt.Errorf("error getting sign: %v", err)
	}

	sub, err := chain.Conn.Api.RPC.Author.SubmitAndWatchExtrinsic(ext)
	if err != nil {
		return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
	}

	defer sub.Unsubscribe()

	timeout := time.NewTimer(time.Second * time.Duration(12))
	defer timeout.Stop()

	for {
		select {
		case status := <-sub.Chan():
			if status.IsInBlock {
				logs.Result(fmt.Sprintf("------------------ Extrinsic completed ------------------ : %#x", status.AsInBlock))

				tEvents := events.EventRecords{}
				txhash, _ = codec.EncodeToHex(status.AsInBlock)
				h, err := chain.Conn.Api.RPC.State.GetStorageRaw(chain.Conn.KeyEvents, status.AsInBlock)
				if err != nil {
					return txhash, fmt.Errorf("error getting storage raw: %v", err)
				}

				err = types.EventRecordsRaw(*h).DecodeEventRecords(chain.Conn.Metadata, &tEvents)
				if err != nil {
					return txhash, fmt.Errorf("DecodeEventRecords error : %v", err)
				}

				for _, e := range tEvents.HashrateMarket_MachineRemoved {
					if codec.Eq(e.Id, machineUUID) {
						logs.Result("Machine Removed bingo!!!")
						return txhash, nil
					}
				}
				return txhash, errors.New(pattern.ERR_Failed)
			}
		case err = <-sub.Err():
			return txhash, fmt.Errorf("error submitting extrinsic: %v", err)
		case <-timeout.C:
			return txhash, errors.New(pattern.ERR_Timeout)
		}
	}
}

func (chain WrapperMatrix) GetMachine(hardwareInfo machine_info.MachineInfo) (pattern.MachineDetails, error) {

	var data pattern.MachineDetails

	machineUUID, err := utils.ParseMachineUUID(string(hardwareInfo.MachineUUID))
	if err != nil {
		return data, errors.New(fmt.Sprintf("Error parsing uuid: %v", err))
	}

	id, err := codec.Encode(machineUUID)
	key, err := types.CreateStorageKey(chain.Conn.Metadata, pattern.HASHRATE_MARKET, pattern.MACHINE, chain.Wallet.KeyringPair.PublicKey, id)
	if err != nil {
		return data, errors.New(fmt.Sprintf("Error creating %s %s storage key: %v", pattern.HASHRATE_MARKET, pattern.MACHINE, err))
	}

	_, err = chain.Conn.Api.RPC.State.GetStorageLatest(key, &data)
	if err != nil {
		return data, errors.New(fmt.Sprintf("Error getting %s %s storage: %v", pattern.HASHRATE_MARKET, pattern.MACHINE, err))
	}
	return data, nil
}

func NewMatrixWrapper(info *chain.InfoChain) *WrapperMatrix {
	return &WrapperMatrix{info}
}
