defmodule EvmScanRpc.CamelcaseSnakecase do
  def camelcase_to_snakecase(camel_str) when is_bitstring(camel_str) do
    Macro.underscore(camel_str)
  end

  def valid_fields() do
    fields = block_fields() ++ withdrawal_fields() ++ transcation_fields()
    Enum.map(fields, fn str -> camelcase_to_snakecase(str) end)
  end

  defp block_fields() do
    [
      "baseFeePerGas",
      "difficulty",
      "extraData",
      "gasLimit",
      "gasUsed",
      "hash",
      "logsBloom",
      "miner",
      "mixHash",
      "nonce",
      "number",
      "parentHash",
      "receiptsRoot",
      "sha3Uncles",
      "size",
      "stateRoot",
      "timestamp",
      "totalDifficulty",
      "transactions",
      "transactionsRoot",
      "uncles",
      "withdrawals",
      "withdrawalsRoot"
    ]
  end

  defp withdrawal_fields() do
    ["index", "validatorIndex", "address", "amount"]
  end

  defp transcation_fields() do
    [
      "blockHash",
      "blockNumber",
      "from",
      "gas",
      "gasPrice",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "hash",
      "input",
      "nonce",
      "to",
      "transactionIndex",
      "value",
      "type",
      "",
      "chainId",
      "v",
      "r",
      "s"
    ]
  end
end
