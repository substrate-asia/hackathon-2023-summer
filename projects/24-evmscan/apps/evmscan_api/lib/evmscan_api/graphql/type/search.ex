defmodule EvmscanApi.Graphql.Type.Search do
  use Absinthe.Schema.Notation

  object :search_query do
    field :search, :search do
    end
  end

  object :search do
    field :type, :string
    field :redirect_url, :string
  end
end
