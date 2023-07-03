package p2p

import (
	"fmt"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/samirshao/itools/icrypto"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"io"
	"metor-distributor/p2p/proto/msgpb"
)

const (
	pidSaveBlockReq = "/save_block/1.0.0"
	pidGetBlockReq  = "/get_block_req/1.0.0"
	pidGetBlockResp = "/get_block_resp/1.0.0"
)

func (_this *P2P) FindBlockResp(stream network.Stream) {
	defer ihelp.ErrCatch()

	//read buffer
	buf, err := readBuf(stream, 1024*1024*30)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	var data msgpb.Message
	if err = _this.Serializer.Unpack(buf, &data); err != nil {
		ilog.Logger.Error(err)
		return
	}

	var address string
	if address, err = _this.Account.VerifySign(data.Data, data.Signature); err != nil {
		ilog.Logger.Error(err)
		return
	}

	hash := icrypto.Sha256(data.Data).ToHex()

	blockChan, ok := _this.ChanMap.Load(hash)
	if !ok {
		ilog.Logger.Warnf("Abnormal data received [%s %s]", address, hash)
		return
	}

	blockChan.(chan []byte) <- data.Data
}

// 读取数据流
// maxSize 设定最大接收字节数，超过最大值会返回错误
func readBuf(stream network.Stream, maxSize int) ([]byte, error) {
	data := make([]byte, 0)
	receive := 0
	for {
		buf := make([]byte, 1024)
		n, err := stream.Read(buf)
		if err != nil {
			if err == io.EOF || err == network.ErrReset {
				break
			}
			ilog.Logger.Error(err)
			return nil, err
		} else if receive > maxSize {
			_ = stream.Close()
			err = fmt.Errorf("maximum data reception exceeded")
			ilog.Logger.Error(err)
			return nil, err
		}
		receive += n
		data = append(data, buf[:n]...)
	}
	return data, nil
}
