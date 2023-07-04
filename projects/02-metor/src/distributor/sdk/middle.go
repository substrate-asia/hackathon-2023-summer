package sdk

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func (_this *Sdk) middles() []gin.HandlerFunc {
	return []gin.HandlerFunc{gin.Logger(), gin.Recovery(), middleProxy()}
}

// Proxy 全局跨域设置中间件，如果是关机状态，阻断请求
func middleProxy() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*") // 这是允许访问所有域
		c.Header("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-CSRF-Token, Session,X_Requested_With,Accept, Origin, Host, Connection, Accept-Encoding, Accept-Language,DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Pragma, Referer")
		c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		c.Next()
	}
}
