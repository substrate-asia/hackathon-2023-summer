defmodule EvmscanApi.Router do
  use EvmscanApi, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", EvmscanApi do
    pipe_through :api
  end
end
