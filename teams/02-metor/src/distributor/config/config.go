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

const (
	home = "metor/distributor/"
)

var Core *Tpl

// Tpl 配置文件模版
type Tpl struct {
	//数据目录
	Home string
	//rpc监听
	RpcHost string `mapstructure:"rpc_host" def:"127.0.0.1:8901"`
	//libp2p监听
	P2PHost []string `mapstructure:"p2p_host" def:"/ip4/0.0.0.0/tcp/8911"`
	//leveldb目录
	DataStore string `mapstructure:"data_store" def:"datastore"`
	//Cpu核心数
	CpuNum int `mapstructure:"cpu_num" def:"4"`
	//p2p.bootstrap
	Bootstrap []string `mapstructure:"bootstrap" def:"/ip4/127.0.0.1/tcp/8911/p2p/12D3KooWHG1w8S555DnCBbbgnMkoNqmdVPz9QxLuHb6DWLEGe8pg"`
}

// 初始化
func NewConfig() {
	u, err := user.Current()
	if err != nil {
		ilog.Logger.Fatalln(err)
	}
	dir := u.HomeDir + "/" + home
	//todo 测试用的dataDir
	dir = "./cellular/1/"

	if !ifile.IsExist(dir) {
		_ = ifile.MakeDir(dir)
	}

	//配置文件路径
	conf := dir + "config.yaml"

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
	if err = vip.Unmarshal(Core); err != nil {
		ilog.Logger.Fatalf("解析配置文件错误 %v", err)
	}

	//设置数据目录
	Core.Home = dir

	ilog.Logger.Debugf("配置文件加载成功")
}
