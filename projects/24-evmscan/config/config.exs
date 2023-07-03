import Config

# Configure Mix tasks and generators
config :evmscan_schema,
  ecto_repos: [EvmscanSchema.Repo]

config :evmscan_api,
  generators: [context_app: false]

# Configures the endpoint
config :evmscan_api, EvmscanApi.Endpoint,
  url: [host: "localhost"],
  render_errors: [
    formats: [json: EvmscanApi.ErrorJSON],
    layout: false
  ],
  pubsub_server: EvmscanApi.PubSub,
  live_view: [signing_salt: "fEpbQF/w"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :tesla, :adapter, {Tesla.Adapter.Finch, name: FinchRpc.Client}

config :evmscan_rpc, url: "https://rpc.sepolia.org"
# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
