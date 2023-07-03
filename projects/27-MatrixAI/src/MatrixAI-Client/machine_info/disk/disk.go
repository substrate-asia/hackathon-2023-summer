package disk

import (
	"fmt"
	"github.com/shirou/gopsutil/v3/disk"
)

// InfoDisk 定义 InfoDisk 结构体
type InfoDisk struct {
	Path       string  `json:"Path"`       // 磁盘路径（如：/dev/sda1）
	TotalSpace float64 `json:"TotalSpace"` // 总共的硬盘空间大小，单位 GB
	FreeSpace  float64 `json:"FreeSpace"`  // 可用的硬盘空间大小，单位 GB
}

// GetDiskInfo 获取硬盘信息并返回 InfoDisk 结构体切片
func GetDiskInfo() ([]InfoDisk, error) {
	diskInfos := make([]InfoDisk, 0)
	partitions, err := disk.Partitions(true)
	if err != nil {
		return nil, fmt.Errorf("failed to get disk info: %w", err)
	}

	for _, p := range partitions {
		usage, err := disk.Usage(p.Mountpoint)
		if err != nil {
			continue
		}
		diskInfos = append(diskInfos, InfoDisk{
			Path:       p.Device,
			TotalSpace: float64(usage.Total) / (1 << 30),
			FreeSpace:  float64(usage.Free) / (1 << 30),
		})
	}
	return diskInfos, nil
}
