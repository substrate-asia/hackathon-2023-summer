package p2p

import (
	"errors"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/samirshao/itools/icrypto"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"io"
	"os"
	"strings"
)

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
			stream.Close()
			ilog.Logger.Error("超出最大接收数据量")
			return nil, errors.New("超出最大接收数据量")
		}
		receive += n
		data = append(data, buf[:n]...)
	}
	return data, nil
}

// 存储文件
func fileStore(dir string, data []byte) error {
	hash := icrypto.Sha256(data).ToHex()
	dir = dir + "/" + strings.ToUpper(hash[:2])
	if !ifile.IsExist(dir) {
		_ = ifile.MakeDir(dir)
	}
	dest := dir + "/" + hash
	if err := os.WriteFile(dest, data, 0666); err != nil {
		ilog.Logger.Error(err)
		return err
	}
	return nil
}

// 读取文件
func fileRead(dir string, hash string) ([]byte, error) {
	dir = dir + "/" + strings.ToUpper(hash[:2])
	dest := dir + "/" + hash
	data, err := os.ReadFile(dest)
	if err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return data, nil
}
