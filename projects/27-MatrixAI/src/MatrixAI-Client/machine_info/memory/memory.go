package memory

import (
	"fmt"

	"github.com/shirou/gopsutil/v3/mem"
)

// InfoMemory 定义 InfoMemory 结构体
type InfoMemory struct {
	TotalMemory float64 `json:"TotalMemory"` // 总内存大小，单位 GB
}

// GetMemoryInfo 获取内存信息并返回 InfoMemory 结构体
func GetMemoryInfo() (InfoMemory, error) {
	vmStat, err := mem.VirtualMemory()
	if err != nil {
		return InfoMemory{}, fmt.Errorf("failed to get memory info: %w", err)
	}

	return InfoMemory{
		TotalMemory: float64(vmStat.Total) / (1 << 30),
	}, nil
}
