defmodule EvmscanApi.Graphql.Type.Block do
  use Absinthe.Schema.Notation
  alias EvmscanApi.Graphql.Resolver.Block, as: Resolver

  object :block_query do
    field :block, :block do
      resolve(&Resolver.block/3)
    end

    field :blocks, list_of(:block) do
      resolve(&Resolver.blocks/3)
    end
  end

  object :block do
    field :base_fee_per_gas, :string
    field :difficulty, :string
    field :extra_data, :string
    field :gas_limit, :string
    field :gas_used, :string
    field :hash, :string
    field :logs_bloom, :string
    field :miner, :string
    field :mix_hash, :string
    field :nonce, :string
    field :number, :string
    field :parent_hash, :string
    field :receipts_root, :string
    field :sha3_uncles, :string
    field :size, :string
    field :state_root, :string
    field :timestamp, :string
    field :total_difficulty, :string

    field :transactions, list_of(:transaction) do
      resolve &Resolver.transactions/3
    end

    field :transactions_root, :string
    field :uncles, list_of(:string)

    field :withdrawals, list_of(:withdrawal) do
      resolve &Resolver.withdrawals/3
    end

    field :withdrawals_root, :string
  end
end
