defmodule EvmscanApi.Graphql.Type.SmartContract do
  use Absinthe.Schema.Notation

  object :smart_contract_query do
    field :smart_contract, :smart_contract do
    end
  end

  object :smart_contract do
    field :address, :string
  end
end
