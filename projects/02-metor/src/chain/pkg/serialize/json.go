package serialize

import (
	"encoding/json"
)

type Json struct {
}

func NewJson() *Json {
	return &Json{}
}

func (_this *Json) Pack(args any) ([]byte, error) {
	return json.Marshal(args)
}

func (_this *Json) Unpack(data []byte, obj any) error {
	return json.Unmarshal(data, obj)
}
