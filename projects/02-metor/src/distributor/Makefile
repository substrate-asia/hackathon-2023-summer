.PHONY: all proto

VERSION = v0.1
COMPILE_TIME = $(shell date +"%m%d.%H%M")
PROCESS_NAME = metor-d

all:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-X main.Version=${VERSION}.${COMPILE_TIME}" -o ./build/${PROCESS_NAME} cmd/main.go
	go build -ldflags "-X main.Version=${VERSION}.${COMPILE_TIME}" -o ./build/${PROCESS_NAME} cmd/main.go

proto:
	protoc --gofast_out=. ./p2p/proto/*.proto
	protoc --gofast_out=. --go-grpc_out=. --grpc-gateway_out=. ./rpc/proto/files.proto