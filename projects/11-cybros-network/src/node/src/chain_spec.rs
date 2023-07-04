// This file is part of Cybros.

// Copyright (C) Jun Jiang.
// SPDX-License-Identifier: GPL-3.0-or-later

// Cybros is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Cybros is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Cybros.  If not, see <http://www.gnu.org/licenses/>.

use std::str::FromStr;
use primal_runtime::{
	AccountId,
	AuraConfig, BalancesConfig, RuntimeGenesisConfig, GrandpaConfig, SudoConfig, SystemConfig, WASM_BINARY,
};
use sc_chain_spec::Properties;
use sc_service::ChainType;
use sp_consensus_aura::sr25519::AuthorityId as AuraId;
use sp_consensus_grandpa::AuthorityId as GrandpaId;
use serde::Deserialize;

/// The struct for JSON format genesis config
///
/// Json sample:
/// ```
/// {
///   "rootKey": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
///   "initialAuthorities": [
///     [
///       "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // SS58 format of the validator account
///       "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // SS58 format of the AURA key
///       "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" // SS58 format of the Grandpa key
///     ]
///   ],
///   "endowedAccounts": [
///     [
///       "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
///       "1000000000000000000"
///     ],
///     [
///       "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
///       "1000000000000000000"
///     ],
///     [
///       "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
///       "1000000000000000000"
///     ],
///     [
///       "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
///       "1000000000000000000"
///     ]
///   ]
/// }
/// ```
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
struct GenesisConfigProfile {
	root_key: AccountId,
	initial_authorities: Vec<(AccountId, AuraId, GrandpaId)>,
	endowed_accounts: Vec<(AccountId, String)>,
}

// The URL for the telemetry server.
// const STAGING_TELEMETRY_URL: &str = "wss://telemetry.polkadot.io/submit/";

/// Specialized `ChainSpec`. This is a specialization of the general Substrate ChainSpec type.
pub type ChainSpec = sc_service::GenericChainSpec<RuntimeGenesisConfig>;

pub fn development() -> Result<ChainSpec, String> {
	let genesis_profile_in_bytes = include_bytes!("../res/development_network_genesis_config.json");
	let genesis_profile: GenesisConfigProfile =
		serde_json::from_slice(genesis_profile_in_bytes).expect("Bad chain profile");

	chain_spec_for(
		"Cybros Primal development",
		"cybros_primal_dev",
		ChainType::Development,
		genesis_profile
	)
}

/// Local network for demo or simulation production network
/// Mnemonic: nut hire energy drill planet book wreck post saddle lend barrel twin
pub fn local() -> Result<ChainSpec, String> {
	let genesis_profile_in_bytes = include_bytes!("../res/local_network_genesis_config.json");
	let genesis_profile: GenesisConfigProfile =
		serde_json::from_slice(genesis_profile_in_bytes).expect("Bad chain profile");

	chain_spec_for(
		"Cybros Primal local",
		"cybros_primal_local",
		ChainType::Local,
		genesis_profile
	)
}

fn chain_spec_for(
	name: &str,
	id: &str,
	chain_type: ChainType,
	genesis_profile: GenesisConfigProfile,
) -> Result<ChainSpec, String> {
	let wasm_binary = WASM_BINARY.ok_or_else(|| "Development wasm not available".to_string())?;

	Ok(
		ChainSpec::from_genesis(
			name,
			id,
			chain_type,
			move || {
				let genesis_profile = genesis_profile.clone();
				genesis_config(
					wasm_binary,
					// Initial PoA authorities
					genesis_profile.initial_authorities,
					// Sudo account
					genesis_profile.root_key,
					// Pre-funded accounts
					genesis_profile.endowed_accounts
						.into_iter()
						.map(|(k, amount)| (k, u128::from_str(&amount).expect("Bad amount")))
						.collect(),
					true
				)
			},
			vec![],
			None,
			None,
			None,
			chain_properties(),
			None,
		)
	)
}

/// Configure initial storage state for FRAME modules.
fn genesis_config(
	wasm_binary: &[u8],
	initial_authorities: Vec<(AccountId, AuraId, GrandpaId)>,
	root_key: AccountId,
	endowed_accounts: Vec<(AccountId, u128)>,
	_enable_println: bool,
) -> RuntimeGenesisConfig {
	assert!(
		initial_authorities
			.iter()
			.map(|(k, _, _)| k)
			.chain(&[root_key.clone()])
			.cloned()
			.all(|account| {
				endowed_accounts
					.iter()
					.any(|(endowed, _)| account == endowed.clone())
			}),
		"All the genesis accounts must be endowed; qed."
	);

	RuntimeGenesisConfig {
		system: SystemConfig {
			// Add Wasm runtime to storage.
			code: wasm_binary.to_vec(),
		},
		aura: AuraConfig {
			authorities: initial_authorities.iter().map(|x| (x.1.clone())).collect()
		},
		grandpa: GrandpaConfig {
			authorities: initial_authorities.iter().map(|x| (x.2.clone(), 1)).collect()
		},
		balances: BalancesConfig {
			balances: endowed_accounts,
		},
		transaction_payment: Default::default(),
		vesting: Default::default(),
		sudo: SudoConfig {
			key: Some(root_key),
		},
	}
}

fn chain_properties() -> Option<Properties> {
	let mut p = Properties::new();

	p.insert("tokenSymbol".into(), "CBT".into());
	p.insert("tokenDecimals".into(), 12.into());
	p.insert("ss58Format".into(), 42.into());

	Some(p)
}
