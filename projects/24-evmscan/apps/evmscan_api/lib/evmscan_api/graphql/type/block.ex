defmodule EvmscanApi.Graphql.Type.Block do
  use Absinthe.Schema.Notation

  object :block_query do
    field :block, :block do
    end
  end

  object :block do
    field :block_hash, :string
  end
end
