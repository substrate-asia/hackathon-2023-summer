package errs

import "google.golang.org/grpc/codes"

const (
	GetMiners codes.Code = iota + 1000
	MinerZero
	NodeKind
	RoleUnknown
	ParseMsg
	UploadMetaData
	VerifySign
	TeePublicKey
	GetMinerFileHash
	MinerHashZero
	RewardUser
)
