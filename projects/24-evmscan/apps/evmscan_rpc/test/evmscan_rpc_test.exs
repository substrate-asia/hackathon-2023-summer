defmodule EvmscanRpcTest do
  use ExUnit.Case
  doctest EvmscanRpc

  test "greets the world" do
    assert EvmscanRpc.hello() == :world
  end
end
