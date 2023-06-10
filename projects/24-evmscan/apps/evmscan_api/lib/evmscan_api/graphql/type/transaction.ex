defmodule EvmscanApi.Graphql.Type.Transaction do
  use Absinthe.Schema.Notation

  object :transaction_query do
    field :transaction, :transaction do
    end
  end

  object :transaction do
    field :hash, :string
  end
end
