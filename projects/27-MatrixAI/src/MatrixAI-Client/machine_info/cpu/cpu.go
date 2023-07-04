package cpu

import (
	"fmt"
	"github.com/shirou/gopsutil/v3/cpu"
)

// InfoCPU CPU 信息
type InfoCPU struct {
	ModelName string  `json:"ModelName"` // CPU 名称
	Cores     int32   `json:"Cores"`     // CPU 核心数
	Mhz       float64 `json:"Mhz"`       // CPU 频率，单位 MHz
}

// GetCPUInfo 获取 CPU 信息并返回 InfoCPU 结构体切片
func GetCPUInfo() ([]InfoCPU, error) {
	cpuInfos := make([]InfoCPU, 0)
	cpuInfoStats, err := cpu.Info()
	if err != nil {
		return nil, fmt.Errorf("failed to get CPU info: %w", err)
	}

	for _, info := range cpuInfoStats {
		cpuInfos = append(cpuInfos, InfoCPU{
			ModelName: info.ModelName,
			Cores:     info.Cores,
			Mhz:       info.Mhz,
		})
	}
	return cpuInfos, nil
}
