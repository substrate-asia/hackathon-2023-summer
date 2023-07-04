defmodule EvmscanApi.Graphql.Type.Address do
  use Absinthe.Schema.Notation

  object :address_query do
    field :address, :address do
    end
  end

  object :address do
    field :address, :string
  end
end
