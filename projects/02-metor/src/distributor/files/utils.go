package files

import (
	"fmt"
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"os"
)

// 默克树在datastore中的key名称
func metaKey(root string) string {
	return "meta/" + root
}

func fileinfo(fPath string) (fileData []byte, fi os.FileInfo, err error) {
	fi = ifile.FileStat(fPath)
	if fi == nil {
		err = fmt.Errorf("can not found %s", fPath)
		ilog.Logger.Error(err)
		return
	}
	//if fi.IsDir() {
	//	ilog.Logger.Errorf("not support dir")
	//	return
	//}
	fileData, err = os.ReadFile(fPath)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	return
}
