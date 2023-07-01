defmodule EvmscanApi.Graphql.Schema do
  alias EvmscanApi.Graphql.DataloaderEcto

  use Absinthe.Schema
  # import CustomTypes
  import_types(EvmscanApi.Graphql.Type.Custom)
  import_types(EvmscanApi.Graphql.Type.Custom.JSON)
  import_types(EvmscanApi.Graphql.Type.Custom.UUID4)
  import_types(EvmscanApi.Graphql.Type.Custom.Money)
  import_types(EvmscanApi.Graphql.Type.Custom.BigInt)

  # query/mutation/subscribe type
  import_types(EvmscanApi.Graphql.Type.Address)
  import_types(EvmscanApi.Graphql.Type.Common)
  import_types(EvmscanApi.Graphql.Type.Block)
  import_types(EvmscanApi.Graphql.Type.HomePage)
  import_types(EvmscanApi.Graphql.Type.Search)
  import_types(EvmscanApi.Graphql.Type.SmartContract)
  import_types(EvmscanApi.Graphql.Type.TokenTransfer)
  import_types(EvmscanApi.Graphql.Type.Transaction)
  import_types(EvmscanApi.Graphql.Type.Withdrawal)

  def middleware(middleware, _field, _object) do
    middleware
  end

  def context(ctx) do
    loader =
      Dataloader.new()
      |> Dataloader.add_source(:graphql, DataloaderEcto.data())

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end

  query do
    import_fields(:address_query)
    import_fields(:block_query)
    import_fields(:home_page_query)
    import_fields(:search_query)
    import_fields(:smart_contract_query)
    import_fields(:token_transfer_query)
    import_fields(:transaction_query)
  end

  # mutation do
  # end

  # subscription do
  # end
end
