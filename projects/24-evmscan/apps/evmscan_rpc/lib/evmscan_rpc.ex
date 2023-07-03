defmodule EvmscanRpc do
  @moduledoc """
  Documentation for `EvmscanRpc`.
  """

  use Tesla

  require Logger

  plug(Tesla.Middleware.BaseUrl, Application.get_env(:evmscan_rpc, :url))
  plug(Tesla.Middleware.JSON)

  def get_block_by_number(id \\ 1, params \\ ["latest", false]) do
    params = %{
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: params,
      id: id
    }

    post("/", params)
    |> parse_result()
  end

  def get_block_by_hash(
        id \\ 2,
        params \\ ["0x0000000000000000000000000000000000000000000000000000000000000000", false]
      ) do
    params = %{
      jsonrpc: "2.0",
      method: "eth_getBlockByHash",
      params: params,
      id: id
    }

    post("/", params)
    |> parse_result()
  end

  def parse_result(res) do
    case res do
      {:ok, %Tesla.Env{body: %{"result" => result}}} ->
        {:ok, result}

      {:ok, %Tesla.Env{body: %{"error" => error}}} ->
        Logger.error(fn -> "rpc fail with error: #{inspect(error)}" end)
        {:error, error}
    end
  end
end
