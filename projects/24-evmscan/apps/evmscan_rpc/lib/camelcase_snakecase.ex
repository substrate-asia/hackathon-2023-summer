defmodule EvmScanRpc.CamelcaseSnakecase do
  def camelcase_to_snakecase(camel_str) when is_bitstring(camel_str) do
    Macro.underscore(camel_str)
  end

  def camelcase_to_snakecase(lx_str) when is_list(lx_str) do
    Enum.map(lx_str, fn str -> camelcase_to_snakecase(str) end)
  end

  def valid_fields() do
    fields = block_fields() ++ withdrawal_fields() ++ transaction_fields()
    Enum.map(fields, fn str -> camelcase_to_snakecase(str) end)
  end

  def block_fields() do
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

  def withdrawal_fields() do
    ["index", "validatorIndex", "address", "amount"]
  end

  def transaction_fields() do
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
      "accessList",
      "chainId",
      "v",
      "r",
      "s"
    ]
  end
end
