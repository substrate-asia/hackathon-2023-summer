defmodule EvmscanApi.Graphql.Type.Withdrawal do
  use Absinthe.Schema.Notation

  object :withdrawal do
    field :block_hash, :string
    field :index, :string
    field :validator_index, :string
    field :address, :string
    field :amount, :string
  end
end
