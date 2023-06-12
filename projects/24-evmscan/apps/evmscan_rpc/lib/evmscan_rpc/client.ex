defmodule EvmscanRpc.Client do
  use Tesla

  adapter Tesla.Adapter.Finch, name: FinchRpc
end
