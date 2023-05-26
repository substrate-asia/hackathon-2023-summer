package serialize

import (
	"github.com/gogo/protobuf/proto"
)

type Protobuf struct {
}

func (_this *Protobuf) Pack(data any) ([]byte, error) {
	return proto.Marshal(data.(proto.Message))
}

func (_this *Protobuf) Unpack(data []byte, obj any) error {
	return proto.Unmarshal(data, obj.(proto.Message))
}
