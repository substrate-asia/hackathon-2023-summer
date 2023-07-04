defmodule EvmscanApi.Graphql.Type.Transaction do
  use Absinthe.Schema.Notation
  alias EvmscanApi.Graphql.Resolver.Transaction, as: Resolver

  object :transaction_query do
    field :transaction, :transaction do
      resolve(&Resolver.transaction/3)
    end

    field :transactions, list_of(:transaction) do
      resolve(&Resolver.transactions/3)
    end
  end

  object :transaction do
    field :block_hash, :string
    field :block_number, :string
    field :from, :string
    field :gas, :string
    field :gas_price, :string
    field :max_fee_per_gas, :string
    field :max_priority_fee_per_gas, :string
    field :hash, :string
    field :input, :string
    field :nonce, :string
    field :to, :string
    field :transaction_index, :string
    field :value, :string
    field :type, :string
    field :access_list, list_of(:string)
    field :chain_id, :string
    field :v, :string
    field :r, :string
    field :s, :string
  end
end
