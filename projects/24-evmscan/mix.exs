defmodule Evmscan.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "apps",
      version: "0.1.0",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      apps: [
        :evmscan_schema,
        :evmscan_rpc,
        :evmscan_indexer,
        :evmscan_api
      ],
      releases: releases(),
      default_release: :evmscan
    ]
  end

  # Dependencies listed here are available only for this
  # project and cannot be accessed from applications inside
  # the apps folder.
  #
  # Run "mix help deps" for examples and options.
  defp deps do
    [
      {:nimble_pool, "~> 1.0"},
      {:rustler, "~> 0.28.0"}
    ]
  end

  defp releases do
    [
      evmscan: [
        applications: [
          evmscan_schema: :permanent,
          evmscan_indexer: :permanent,
          evmscan_api: :permanent
        ],
        include_erts: true
      ],
      evmscan_without_indexer: [
        applications: [
          evmscan_schema: :permanent,
          evmscan_api: :permanent
        ],
        include_erts: true
      ]
    ]
  end
end
