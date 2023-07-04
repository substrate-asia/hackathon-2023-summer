import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :evmscan_schema, EvmscanSchema.Repo,
  username: "postgres",
  # password: "postgres123",
  password: "postgres",
  hostname: "localhost",
  # port: 35432,
  port: 5432,
  database: "evmscan_schema_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :evmscan_api, EvmscanApi.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "zKbzsxpLkCM/OmP5Xuxy4Zbbw+pQ1CxMaL8BiuQK2gpht0PkwKPAEHuoJY6hqE8x",
  server: false
