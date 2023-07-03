package common

type Serializer interface {
	Pack(args any) ([]byte, error)
	Unpack(data []byte, obj any) error
}
