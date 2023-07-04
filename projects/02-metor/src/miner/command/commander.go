package command

import "github.com/spf13/cobra"

type Commander interface {
	New() []*cobra.Command
}
