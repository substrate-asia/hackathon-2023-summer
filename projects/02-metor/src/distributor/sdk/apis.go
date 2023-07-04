package sdk

import (
	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
	"github.com/samirshao/itools/ilog"
	"github.com/samirshao/itools/iresp"
	"io/fs"
	"metor-distributor/common"
	"path/filepath"
)

type ApiFiles struct {
	Files   Files
	Storage common.Storage
}

type addReq struct {
	Path string `json:"path" form:"path" binding:"required"`
}

type getReq struct {
	Cid string `json:"cid" form:"cid" binding:"required"`
}

func (_this *ApiFiles) Add(c *gin.Context) {
	var req addReq
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(200, iresp.Error(errShouldBind))
		return
	}

	//var cid string
	resp := make([]map[string]string, 0)
	err := filepath.Walk(req.Path, func(path string, info fs.FileInfo, err error) error {
		if !info.IsDir() {
			var cid string
			if cid, err = _this.Files.Add(path); err != nil {
				ilog.Logger.Error(err)
			} else {
				resp = append(resp, map[string]string{
					"cid":  cid,
					"path": path,
				})
			}
		}
		return nil
	})
	if err != nil {
		c.JSON(200, iresp.Error(errFilePath))
		return
	}

	c.JSON(200, iresp.Success(0, resp))
}

func (_this *ApiFiles) Get(c *gin.Context) {
	//var req getReq
	//if err := c.ShouldBind(&req); err != nil {
	//	c.JSON(200, iresp.Error(errShouldBind))
	//	return
	//}

	cid := c.Param("cid")
	if cid == "" {
		c.JSON(200, iresp.Error(errCid))
		return
	}

	path, err := _this.Files.FindFile(cid)
	if err != nil {
		c.JSON(200, iresp.Error(errFindFile))
		return
	}

	mtype, err := mimetype.DetectFile(path)
	if err != nil {
		c.JSON(200, iresp.Error(errDetectFile))
		return
	}

	c.Writer.Header().Set("Content-Type", mtype.String())
	c.File(path)
}
