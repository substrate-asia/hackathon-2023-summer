package rpc

import (
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_recovery "github.com/grpc-ecosystem/go-grpc-middleware/recovery"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"google.golang.org/grpc"
	"metor-distributor/config"
	"metor-distributor/rpc/proto/filespb"
	"metor-distributor/rpc/srv"
	"net"
)

type Server struct{}

func (_this *Server) Start() {
	defer ihelp.ErrCatch()

	ilog.Logger.Infof("rpc listen on %s", config.Api.RpcHost)

	//添加grpc配置
	var opts []grpc.ServerOption
	opts = append(opts, grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
		grpc_recovery.UnaryServerInterceptor(recovery()),
	)))
	server := grpc.NewServer(opts...)
	//注册服务和反射
	filespb.RegisterFilesSrvServer(server, &srv.FilesSrv{})

	//开启监听
	listener, err := net.Listen("tcp", config.Api.RpcHost)
	if err != nil {
		ilog.Logger.Error(err)
		return
	}
	defer listener.Close()

	if err = server.Serve(listener); err != nil {
		ilog.Logger.Error(err)
		return
	}
}
