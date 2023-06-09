defmodule EvmscanApi.Repo do
  use Ecto.Repo,
    otp_app: :evmscan_api,
    adapter: Ecto.Adapters.Postgres
end
