defmodule EvmscanApi.Graphql.DataloaderEcto do
  def data() do
    Dataloader.Ecto.new(EvmscanSchema.Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end
end
