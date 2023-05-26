package serialize

import (
	"bytes"
	"encoding/gob"
	"github.com/samirshao/itools/ilog"
)

type Gob struct {
}

func (_this *Gob) Pack(args any) ([]byte, error) {
	buf := bytes.Buffer{}
	encoder := gob.NewEncoder(&buf)
	if err := encoder.Encode(args); err != nil {
		ilog.Logger.Error(err)
		return nil, err
	}
	return buf.Bytes(), nil
}

func (_this *Gob) Unpack(data []byte, obj any) error {
	decoder := gob.NewDecoder(bytes.NewReader(data))
	return decoder.Decode(obj)
}
