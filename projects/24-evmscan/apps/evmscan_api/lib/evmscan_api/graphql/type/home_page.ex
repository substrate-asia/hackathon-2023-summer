defmodule EvmscanApi.Graphql.Type.HomePage do
  use Absinthe.Schema.Notation

  object :home_page_query do
    field :home_page, :home_page do
    end
  end

  object :home_page do
    field :block_count, :integer
    field :transaction_count, :integer
  end
end
