import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :evmscan_api, EvmscanApi.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "SIFbZnpAwnpbgQrtVzKB9rh041qjTnQ2LFDFerD04bg9C3tQF63bsdA3UR5dV96T",
  server: false

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :evmscan_api, EvmscanApi.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "jGX+yFDL6aKMfj6UMb4xXWBUL8Dl4z/zKiSBcNn2x6wua0ykir5xuPuJIDJcwMTb",
  server: false

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :evmscan_api, EvmscanApi.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "FPFCykMAsybghqrD2ZcgGaRw9hltKDFwst91vISWZxGw5SwogXBkKB3jZjWXfvbm",
  server: false

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :evmscan_schema, EvmscanSchema.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "evmscan_schema_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :evmscan, Evmscan.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "evmscan_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10
