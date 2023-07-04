package sdk

import (
	"github.com/gin-gonic/gin"
)

func (_this *Sdk) routers() {
	_this.engine.StaticFS("storage", gin.Dir("./storage", true))
	g := _this.engine.Group("files")
	{
		g.GET("add", _this.ApiFiles.Add)
		g.GET("get/:cid", _this.ApiFiles.Get)
	}
}
