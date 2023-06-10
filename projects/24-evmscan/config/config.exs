# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of the Config module.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
import Config

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
  live_view: [signing_salt: "12Avf6HE"]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.2.7",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../apps/evmscan_api/assets", __DIR__)
  ]

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
  live_view: [signing_salt: "MXIWBqtr"]

config :evmscan_api,
  ecto_repos: [EvmscanApi.Repo],
  generators: [context_app: false]

# Configures the endpoint
config :evmscan_api, EvmscanApi.Endpoint,
  url: [host: "localhost"],
  render_errors: [
    formats: [html: EvmscanApi.ErrorHTML, json: EvmscanApi.ErrorJSON],
    layout: false
  ],
  pubsub_server: EvmscanApi.PubSub,
  live_view: [signing_salt: "QCHMHmGC"]

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../apps/evmscan_api/assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.2.7",
  default: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../apps/evmscan_api/assets", __DIR__)
  ]

# Configure Mix tasks and generators
config :evmscan_schema,
  ecto_repos: [EvmscanSchema.Repo]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :evmscan_schema, EvmscanSchema.Mailer, adapter: Swoosh.Adapters.Local

# Configure Mix tasks and generators
config :evmscan,
  ecto_repos: [Evmscan.Repo]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :evmscan, Evmscan.Mailer, adapter: Swoosh.Adapters.Local

# Sample configuration:
#
#     config :logger, :console,
#       level: :info,
#       format: "$date $time [$level] $metadata$message\n",
#       metadata: [:user_id]
#
# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
