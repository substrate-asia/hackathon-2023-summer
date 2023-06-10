defmodule EvmscanSchema.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      EvmscanSchema.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: EvmscanSchema.PubSub}
      # Start a worker by calling: EvmscanSchema.Worker.start_link(arg)
      # {EvmscanSchema.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: EvmscanSchema.Supervisor)
  end
end
