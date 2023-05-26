package rpc

import (
	"context"
	"fmt"
	"github.com/samirshao/itools/ihelp"
	"github.com/samirshao/itools/ilog"
	"google.golang.org/grpc"
	"metor-distributor/rpc/proto/filespb"
)

type Client struct {
	conn *grpc.ClientConn
}

// NewClient 建立rpc连接
func NewClient(host string) *Client {
	opts := []grpc.DialOption{
		grpc.WithInsecure(),
		grpc.WithBlock(),
		//grpc.WithTimeout(time.Second * 10),
		//grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(1024*1024*1024), grpc.MaxCallSendMsgSize(1024*1024*1024)),
	}
	conn, err := grpc.Dial(host, opts...)
	if err != nil {
		ilog.Logger.Fatalln(err)
	}
	return &Client{conn: conn}
}

func (_this *Client) AddFile(fpath string) {
	defer ihelp.ErrCatch()
	defer _this.conn.Close()

	c := filespb.NewFilesSrvClient(_this.conn)
	_, err := c.Add(context.Background(), &filespb.AddReq{
		FilePath: fpath,
	})
	if err != nil {
		ilog.Logger.Error(err)
		return
	}

	fmt.Println("success")
}
