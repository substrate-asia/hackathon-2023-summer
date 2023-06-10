defmodule EvmscanApi.Router do
  use EvmscanApi, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/graphql" do
    pipe_through([:api])

    if Application.compile_env(:evmscan_api, :graphiql, false) do
      get("/", Absinthe.Plug.GraphiQL,
        schema: EvmscanApi.Graphql.Schema,
        interface: :playground,
        log_level: :debug,
        adapter: Absinthe.Adapter.Underscore
      )
    end

    post("/", Absinthe.Plug,
      schema: EvmscanApi.Graphql.Schema,
      log_level: :debug,
      adapter: Absinthe.Adapter.Underscore
    )
  end
end
