package srv

import (
	"context"
	"github.com/samirshao/itools/ifile"
	"io/fs"
	"metor-distributor/files"
	"metor-distributor/rpc/proto/filespb"
	"path/filepath"
)

type FilesSrv struct {
	filespb.UnimplementedFilesSrvServer
}

func (_this *FilesSrv) Add(ctx context.Context, req *filespb.AddReq) (*filespb.AddResp, error) {
	fi := ifile.FileStat(req.FilePath)
	if fi.IsDir() {
		_ = filepath.WalkDir(req.FilePath, func(path string, d fs.DirEntry, err error) error {
			if !d.IsDir() && filepath.Base(path) != ".DS_Store" {
				//dstri := &files.Files{
				//	S1: new(serialize.Json),
				//	S2: new(serialize.Gob),
				//}
				//dstri.Distribute(path)
			}
			return err
		})
	} else {
		dstri := &files.Files{
			Storage:    nil,
			Serializer: nil,
		}
		dstri.Distribute(req.FilePath)
	}

	return &filespb.AddResp{}, nil
}
