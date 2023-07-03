defmodule EvmscanSchema.Block do
  use Ecto.Schema

  @primary_key false
  schema "evmscan_blocks" do
    field :base_fee_per_gas, :string
    field :difficulty, :string
    field :extra_data, :string
    field :gas_limit, :string
    field :gas_used, :string
    field :hash, :string, primary_key: true
    field :logs_bloom, :string
    field :miner, :string
    field :mix_hash, :string
    field :nonce, :string
    field :number, :string
    field :parent_hash, :string
    field :receipts_root, :string
    field :sha3_uncles, :string
    field :size, :string
    field :state_root, :string
    field :timestamp, :string
    field :total_difficulty, :string
    has_many :transactions, EvmscanSchema.Transaction, references: :hash
    field :transactions_root, :string
    field :uncles, :string
    has_many :withdrawals, EvmscanSchema.Withdrawal, references: :hash
    field :withdrawals_root, :string
  end
end
