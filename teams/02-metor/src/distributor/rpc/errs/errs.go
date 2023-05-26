package errs

import "google.golang.org/grpc/codes"

const (
	GetMinerCidPage codes.Code = iota + 1000
	MinerCidZero
	StorageTask
	GetAnswer
)
