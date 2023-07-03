defmodule EvmscanApi.Graphql.Type.TokenTransfer do
  use Absinthe.Schema.Notation

  object :token_transfer_query do
    field :token_transfer, :token_transfer do
    end
  end

  object :token_transfer do
    field :from, :string
    field :to, :string
    field :value, :integer
  end
end
