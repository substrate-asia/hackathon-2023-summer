package config

import (
	"github.com/samirshao/itools/ifile"
	"github.com/samirshao/itools/ilog"
	"github.com/spf13/viper"
	"os/user"
	"reflect"
	"runtime"
	"strings"
)

var (
	Process  = ""
	Version  = ""
	GoosArch = ""
)

const (
	home         = "metor/chain/"
	TeePublicKey = "0x7A65EA3a7C119bEFeeF835AeE64D0576c7bA8B43"
)

const (
	RoleClient = iota + 1
	RoleMiner
	RoleChain
)

var Api *Tpl

// Tpl 配置文件模版
type Tpl struct {
	//数据目录
	Home string
	//rpc监听
	RpcHost string `mapstructure:"rpc_host" def:"127.0.0.1:8921"`
	//libp2p监听
	P2PHost []string `mapstructure:"p2p_host" def:"/ip4/0.0.0.0/tcp/8911"`
	//leveldb目录
	DataStore string `mapstructure:"data_store" def:"datastore"`
	//Cpu核心数
	CpuNum int `mapstructure:"cpu_num" def:"4"`
	//p2p.bootstrap
	Bootstrap []string `mapstructure:"bootstrap" def:"/ip4/127.0.0.1/tcp/8911/p2p/12D3KooWNh9ArR9MmVaizrjRPi2VBo3SRrKkEbYt1JUFGvUc1cqr"`
}

// 初始化
func NewConfig() {
	u, err := user.Current()
	if err != nil {
		ilog.Logger.Fatalln(err)
	}
	dir := u.HomeDir + "/"
	//todo test>>>>>>>>>
	dir = "./"
	//todo <<<<<<<<<<<<<

	homeDir := dir + home
	if !ifile.IsExist(homeDir) {
		_ = ifile.MakeDir(homeDir)
	}

	//配置文件路径
	conf := homeDir + "config.yaml"

	vip := viper.New()

	//没有配置文件则写入默认配置
	if !ifile.IsExist(conf) {
		ref := reflect.TypeOf(Tpl{})
		count := ref.NumField()
		for i := 0; i < count; i++ {
			key := ref.Field(i).Tag.Get("mapstructure")
			def := ref.Field(i).Tag.Get("def")
			if key != "" {
				switch key {
				case "cpu_num":
					vip.SetDefault(key, runtime.NumCPU())
				case "bootstrap", "p2p_host":
					vip.SetDefault(key, strings.Split(def, ","))
				default:
					vip.SetDefault(key, def)
				}
			}
		}
		if err = vip.SafeWriteConfigAs(conf); err != nil {
			ilog.Logger.Fatalf("配置文件写入错误 %v", err)
		}
	}

	//加载配置文件
	vip.SetConfigFile(conf)
	if err = vip.ReadInConfig(); err != nil {
		ilog.Logger.Fatalf("读取配置文件错误 %v", err)
	}

	//解析配置文件
	if err = vip.Unmarshal(&Api); err != nil {
		ilog.Logger.Fatalf("解析配置文件错误 %v", err)
	}

	//设置数据目录
	Api.Home = homeDir

	ilog.Logger.Debugf("配置文件加载成功")
}
