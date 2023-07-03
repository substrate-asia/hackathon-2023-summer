package logs

import (
	"fmt"
	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

const (
	yellow = "\033[33m"
	red    = "\033[31m"
	green  = "\033[32m"
	reset  = "\033[0m"
)

var Logger *zap.Logger

func init() {
	lumberjackLogger := &lumberjack.Logger{
		Filename:   "./logs/log.txt",
		MaxSize:    100,
		MaxBackups: 3,
		MaxAge:     28,
	}

	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig()),
		zapcore.AddSync(lumberjackLogger),
		zap.InfoLevel,
	)

	Logger = zap.New(core)
}

func Normal(message string) {
	fmt.Println(message)
}

func Warning(message string) {
	fmt.Println(yellow + message + reset)
	Logger.Warn(message)
}

func Error(message string) {
	fmt.Println(red + message + reset)
	Logger.Error(message)
}

func Result(message string) {
	fmt.Println(green + message + reset)
	Logger.Info(message)
}
