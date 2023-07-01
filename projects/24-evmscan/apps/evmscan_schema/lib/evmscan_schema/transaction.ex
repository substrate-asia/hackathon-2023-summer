defmodule EvmscanSchema.Transaction do
  use Ecto.Schema

  @primary_key false
  schema "evmscan_transactions" do
    belongs_to :block, EvmscanSchema.Block, foreign_key: :block_hash, references: :hash
    field :block_number, :string
    field :from, :string
    field :gas, :string
    field :gas_price, :string
    field :max_fee_per_gas, :string
    field :max_priority_fee_per_gas, :string
    field :hash, :string, primary_key: true
    field :input, :string
    field :nonce, :string
    field :to, :string
    field :transaction_index, :string
    field :value, :string
    field :type, :string
    field :access_list, {:array, :string}
    field :chain_id, :string
    field :v, :string
    field :r, :string
    field :s, :string
  end
end
