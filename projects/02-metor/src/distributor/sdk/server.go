package sdk

import (
	"github.com/gin-gonic/gin"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"metor-distributor/config"
)

type Sdk struct {
	engine   *gin.Engine
	ApiFiles ApiFiles
}

func (_this *Sdk) Start() {
	defer ihelp.ErrCatch()

	ilog.Logger.Infof("sdk.listen - %s", config.Api.SdkHost)

	gin.SetMode(gin.ReleaseMode)
	_this.engine = gin.New()
	_this.engine.Use(_this.middles()...)
	_this.routers()
	if err := _this.engine.Run(config.Api.SdkHost); err != nil {
		ilog.Logger.Error(err)
		return
	}
}
