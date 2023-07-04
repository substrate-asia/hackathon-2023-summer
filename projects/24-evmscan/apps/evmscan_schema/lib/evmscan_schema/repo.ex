defmodule EvmscanSchema.Repo do
  use Ecto.Repo,
    otp_app: :evmscan_schema,
    adapter: Ecto.Adapters.Postgres
end
