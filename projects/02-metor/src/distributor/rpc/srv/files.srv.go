package srv

import (
	"context"
	"fmt"
	"google.golang.org/grpc/status"
	"metor-distributor/files"
	"metor-distributor/rpc/errs"
	"metor-distributor/rpc/proto/filespb"
)

type FilesSrv struct {
	filespb.UnimplementedFilesSrvServer
}

func (_this *FilesSrv) Add(ctx context.Context, req *filespb.AddReq) (*filespb.AddResp, error) {
	hash, err := files.Api.Distribute(req.Filepath)
	if err != nil {
		return nil, status.Error(errs.FilesAdd, err.Error())
	}
	return &filespb.AddResp{Hash: hash}, nil
}

func (_this *FilesSrv) Get(ctx context.Context, req *filespb.GetReq) (*filespb.GetResp, error) {
	path, err := files.Api.FindFile(req.Cid)
	if err != nil {
		return nil, err
	}
	fmt.Println("filepath:", path)
	return &filespb.GetResp{Path: path}, nil
}
