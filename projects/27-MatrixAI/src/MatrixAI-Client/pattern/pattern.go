package pattern

import (
	"github.com/centrifuge/go-substrate-rpc-client/v4/scale"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
)

// RPC is the url of the node
// const RPC = "ws://172.16.2.168:9944" // 强哥本机
const RPC = "ws://139.196.35.64:9949" // 测试服务器

// DOT is "." character
const DOT = "."

// Pallets
const (
	// OSS is a module about DeOSS
	OSS = "Oss"

	// HASHRATE_MARKET is a module about DeOSS
	HASHRATE_MARKET = "HashrateMarket"

	// SYSTEM is a module about the system
	SYSTEM = "System"
)

// Chain state
const (
	// SYSTEM
	ACCOUNT = "Account"
	EVENTS  = "Events"

	MACHINE = "Machine"
)

// Extrinsic
const (
	// OSS
	TX_OSS_REGISTER = OSS + DOT + "authorize"

	// TX_HASHRATE_MARKET_REGISTER
	TX_HASHRATE_MARKET_REGISTER = HASHRATE_MARKET + DOT + "add_machine"

	TX_HASHRATE_MARKET_ORDER_COMPLETED = HASHRATE_MARKET + DOT + "order_completed"

	TX_HASHRATE_MARKET_ORDER_FAILED = HASHRATE_MARKET + DOT + "order_failed"

	TX_HASHRATE_MARKET_REMOVE_MACHINE = HASHRATE_MARKET + DOT + "remove_machine"
)

type FileHash [64]types.U8

type MachineUUID [16]types.U8

type OrderId [16]types.U8

const (
	ERR_Failed  = "failed"
	ERR_Timeout = "timeout"
	ERR_Empty   = "empty"
)

type MachineDetails struct {
	Metadata types.Text
	Status   MachineStatusEnum
	Price    types.OptionU128
}

type MachineStatusEnum struct {
	Idle    bool
	ForRent bool
	Renting bool
}

func (m *MachineStatusEnum) Decode(decoder scale.Decoder) error {
	b, err := decoder.ReadOneByte()
	if err != nil {
		return err
	}
	if b == 0 {
		m.Idle = true
	} else if b == 1 {
		m.ForRent = true
	} else if b == 2 {
		m.Renting = true
	}
	if err != nil {
		return err
	}
	return nil
}

type OrderPlacedMetadata struct {
	TaskName     string `json:"taskName"`
	Duration     int    `json:"duration"`
	Algorithm    string `json:"algorithm"`
	DataUrl      string `json:"dataUrl"`
	BuyTime      string `json:"buyTime"`
	Price        int    `json:"price"`
	ModelUrl     string `json:"modelUrl"`
	CompleteTime string `json:"completeTime"`
	Evaluate     string `json:"evaluate"`
}

// datasets
const (
	DATASETS_FOLDER = "./server"
	ZIP_NAME        = "/datasets.zip"
)
