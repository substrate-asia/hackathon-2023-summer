package files

import (
	"fmt"
	"github.com/klauspost/reedsolomon"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"math"
	"time"
)

const (
	//基本分割标准2M
	cutSize = int64(1024 * 1024 * 2)
)

type EsCode struct{}

func NewEsCode() *EsCode {
	return &EsCode{}
}

// Split 纠删码编码
// src文件字节
func (_this *EsCode) Split(src []byte) ([][]byte, error) {
	defer ihelp.ErrCatch()

	timestart := time.Now()

	//字节大小
	fsize := len(src)
	if fsize == 0 {
		return nil, fmt.Errorf("filesize is zero")
	}

	//数据块数量
	dataShards := 0
	//校验块数量
	parityShards := 0
	//编码器
	opt := make([]reedsolomon.Option, 0)

	//计算数据分片和奇偶分片数量
	switch {
	case fsize <= 5242880: //0~5M
		dataShards = 2
		parityShards = 1
	case fsize <= 524288000: //5M~500M
		allShards := math.Ceil(float64(fsize) / float64(cutSize))
		parityShards = int(math.Ceil(allShards * 0.05))
		dataShards = int(allShards) - parityShards
	default: //500M~5G
		dataShards = 243
		parityShards = 13
	}

	//如果总数量大于256则采用GF或GF16编码
	if dataShards+parityShards > 256 {
		opt = append(opt, reedsolomon.WithLeopardGF(true))
	}

	enc, err := reedsolomon.New(dataShards, parityShards, opt...)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	//分片
	shards, err := enc.Split(src)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	//加密奇偶分片
	err = enc.Encode(shards)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}

	ilog.Logger.Infof("纠删码编码耗时：%v", time.Now().Sub(timestart))
	ilog.Logger.Infof("文件大小：%d", fsize)
	ilog.Logger.Infof("分块数量：%d+%d\n", dataShards, parityShards)

	return shards, nil
}

func (_this *EsCode) SplitStream(fsPath string) error {
	return nil
}

func (_this *EsCode) Merge() error {
	return nil
}
