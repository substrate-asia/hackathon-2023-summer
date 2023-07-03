defmodule EvmscanSchema.Withdrawal do
  use Ecto.Schema

  schema "evmscan_withdrawals" do
    belongs_to :block, EvmscanSchema.Block, foreign_key: :block_hash, references: :hash
    field :index, :string
    field :validator_index, :string
    field :address, :string
    field :amount, :string
  end
end
