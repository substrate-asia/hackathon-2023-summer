.PHONY: darwin linux proto

VERSION = v0.1.$(shell date +"%m%d.%H%M")
PROCESS_NAME = metor-d
PACKAGE = metor-distributor/config

darwin:
	go build -ldflags "-X ${PACKAGE}.Process=${PROCESS_NAME} -X ${PACKAGE}.Version=${VERSION} -X ${PACKAGE}.GoosArch=x86_64-darwin-amd64" -o ./build/${PROCESS_NAME} cmd/main.go

linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-X ${PACKAGE}.Process=${PROCESS_NAME} -X ${PACKAGE}.Version=${VERSION} -X ${PACKAGE}.GoosArch=x86_64-linux-amd64" -o ./build/${PROCESS_NAME} cmd/main.go

proto:
	protoc --gofast_out=. ./p2p/proto/*.proto
	protoc --gofast_out=. --go-grpc_out=. ./rpc/proto/match.proto