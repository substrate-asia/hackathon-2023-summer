#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract(env = ink_aa::core::env::AAEnvironment)]
mod stake_manager {
    use ink::codegen::EmitEvent;
    use ink::storage::Mapping;
    use ink_aa::core::env::AAEnvironment;
    use ink_aa::traits::stake_manager::{DepositInfo, IStakeManager};

    #[ink(storage)]
    pub struct StakeManager {
        deposits: Mapping<AccountId, DepositInfo<AAEnvironment>>,
    }

    // TODO: 等`event2.0`合并发布之后，转移到`traits`中
    /// 存款成功时触发的事件。
    #[ink(event)]
    pub struct Deposited {
        #[ink(topic)]
        /// 进行存款的账户 ID。
        pub account: AccountId,
        /// 存款总额。
        pub total_deposit: Balance,
    }

    /// 取款成功时触发的事件。
    #[ink(event)]
    pub struct Withdrawn {
        #[ink(topic)]
        /// 进行取款的账户 ID。
        pub account: AccountId,
        /// 取款金额将转入的账户 ID。
        pub withdraw_address: AccountId,
        /// 取款金额。
        pub amount: Balance,
    }

    /// 抵押成功时触发的事件。
    #[ink(event)]
    pub struct StakeLocked {
        #[ink(topic)]
        /// 进行抵押的账户 ID。
        pub account: AccountId,
        /// 抵押总额。
        pub total_staked: Balance,
        /// 抵押在可取回前需要的延迟时间（秒）。
        pub unstake_delay_sec: Timestamp,
    }

    /// 取消抵押成功时触发的事件。
    #[ink(event)]
    pub struct StakeUnlocked {
        #[ink(topic)]
        /// 进行取消抵押的账户 ID。
        pub account: AccountId,
        /// 抵押可以取回的时间。
        pub withdraw_time: Timestamp,
    }

    /// 取回抵押成功时触发的事件。
    #[ink(event)]
    pub struct StakeWithdrawn {
        #[ink(topic)]
        /// 进行取回抵押的账户 ID。
        pub account: AccountId,
        /// 取回抵押金额将转入的账户 ID。
        pub withdraw_address: AccountId,
        /// 取回抵押的金额。
        pub amount: Balance,
    }

    impl StakeManager {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                deposits: Mapping::default(),
            }
        }

        fn increment_deposit(&mut self, account: AccountId, amount: Balance) {
            let mut info = self.get_deposit_info(account);
            let new_amount = info.deposit.checked_add(amount);
            assert!(new_amount.is_some(), "deposit overflow");
            info.deposit = new_amount.unwrap();
            self.deposits.insert(account, &info);
        }
    }

    impl IStakeManager for StakeManager {
        #[ink(message)]
        fn get_deposit_info(&self, account: AccountId) -> DepositInfo {
            self.deposits.get(account).unwrap_or_default()
        }

        #[ink(message)]
        fn balance_of(&self, account: AccountId) -> Balance {
            self.get_deposit_info(account).deposit
        }

        #[ink(message, payable)]
        fn deposit_to(&mut self, account: AccountId) {
            self.increment_deposit(account, Self::env().transferred_value());
            let info = self.get_deposit_info(account);
            self.env().emit_event(Deposited {
                account,
                total_deposit: info.deposit,
            });
        }

        #[ink(message, payable)]
        fn add_stake(&mut self, unstake_delay_sec: Timestamp) {
            let info = self.deposits.get(Self::env().caller()).unwrap_or_default();
            assert!(unstake_delay_sec > 0, "must specify unstake delay");
            assert!(
                unstake_delay_sec >= info.unstake_delay_sec,
                "cannot decrease unstake time"
            );
            let stake = info.stake.checked_add(Self::env().transferred_value());
            assert!(stake.is_some(), "deposit overflow");
            let stake = stake.unwrap();
            assert!(stake > 0, "no stake specified");
            self.deposits.insert(
                Self::env().caller(),
                &DepositInfo {
                    deposit: info.deposit,
                    staked: true,
                    stake,
                    unstake_delay_sec,
                    withdraw_time: 0,
                },
            );
            Self::env().emit_event(StakeLocked {
                account: Self::env().caller(),
                total_staked: stake,
                unstake_delay_sec,
            });
        }

        #[ink(message)]
        fn unlock_stake(&mut self) {
            let info = self.get_deposit_info(self.env().caller());
            assert!(info.unstake_delay_sec > 0, "not staked");
            assert!(info.staked, "already unstaking");
            let withdraw_time = Self::env()
                .block_timestamp()
                .checked_add(info.unstake_delay_sec)
                .unwrap_or(Timestamp::MAX);

            self.deposits.insert(
                Self::env().caller(),
                &DepositInfo {
                    staked: false,
                    withdraw_time,
                    ..info
                },
            );
            Self::env().emit_event(StakeUnlocked {
                account: Self::env().caller(),
                withdraw_time,
            });
        }

        #[ink(message, payable)]
        fn withdraw_stake(&mut self, withdraw_address: AccountId) {
            let info = self.deposits.get(Self::env().caller()).unwrap_or_default();
            let stake = info.stake;
            assert!(stake > 0, "No stake to withdraw");
            assert!(info.withdraw_time > 0, "must call unlockStake() first");
            assert!(
                info.withdraw_time <= Self::env().block_timestamp(),
                "Stake withdrawal is not due"
            );
            self.deposits.insert(
                Self::env().caller(),
                &DepositInfo {
                    unstake_delay_sec: 0,
                    withdraw_time: 0,
                    stake: 0,
                    ..info
                },
            );
            Self::env().emit_event(StakeWithdrawn {
                account: Self::env().caller(),
                withdraw_address,
                amount: stake,
            });
            let transfer_result = self.env().transfer(withdraw_address, stake);

            assert!(transfer_result.is_ok(), "failed to withdraw stake");
        }

        #[ink(message, payable)]
        fn withdraw_to(&mut self, withdraw_address: AccountId, withdraw_amount: Balance) {
            let info = self.deposits.get(Self::env().caller()).unwrap_or_default();
            assert!(withdraw_amount <= info.deposit, "Withdraw amount too large");
            let deposit = info.deposit.checked_sub(withdraw_amount);
            assert!(deposit.is_some(), "deposit overflow");
            let deposit = deposit.unwrap();
            self.deposits
                .insert(Self::env().caller(), &DepositInfo { deposit, ..info });
            self.env().emit_event(Withdrawn {
                account: self.env().caller(),
                withdraw_address,
                amount: withdraw_amount,
            });
            let transfer_result = self.env().transfer(withdraw_address, withdraw_amount);

            assert!(transfer_result.is_ok(), "failed to withdraw");
        }
    }
}
