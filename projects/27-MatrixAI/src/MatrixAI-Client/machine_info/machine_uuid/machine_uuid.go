package machine_uuid

import (
	"fmt"
	"os/exec"
	"strings"
)

type MachineUUID string

func GetInfoMachineUUID() (MachineUUID, error) {
	output, err := exec.Command("wmic", "csproduct", "get", "UUID").Output()
	if err != nil {
		return "", err
	}

	lines := strings.Split(strings.TrimSpace(string(output)), "\n")
	if len(lines) == 2 {
		// 第一行为 "UUID"，第二行为实际 UUID
		return MachineUUID(strings.TrimSpace(lines[1])), nil
		//return "E39911FB-03C7-A00A-B29E-50EBF6B66202", nil
	}
	return "", fmt.Errorf("failed to parse UUID")
}
