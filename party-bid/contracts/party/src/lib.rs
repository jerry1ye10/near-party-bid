// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::ext_contract;
use near_sdk::{env, near_bindgen, setup_alloc, AccountId, PanicOnDefault, Promise};

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Welcome {
    records: UnorderedMap<String, u128>,
    money_goal: u128,
    money_accrued: u128,
}
//Hashmap of accountname: money contributed
//Buy the nft when theres enough money
//distribute tokens based off the hashmap
//Once the nft is sold give money abased off token distribution

// impl Default for Welcome {
//   fn default() -> Self {
//     Self {
//       records: UnorderedMap::new(b"a".to_vec()),
//       money_goal: Welcome::convert_near_to_yecto(2) as u128,
//       money_accrued: 0
//     }
//   }
// }

#[near_bindgen]
impl Welcome {
    #[init]
    pub fn new(money_goal: u128) -> Self {
        assert!(!env::state_exists(), "Already, initialized");
        Self {
            records: UnorderedMap::new(b"a".to_vec()),
            money_goal: money_goal,
            money_accrued: 0,
        }
    }
}

impl Welcome {
    //static functions
    fn convert_near_to_yecto(near_amount: i128) -> i128 {
        return (near_amount * 1000000000000000000000000) as i128;
    }
}

const SINGLE_CALL_GAS: u64 = 200000000000000;
const TOKEN_ID: &str = "34";

#[ext_contract(ext_contract_paras)]
trait ContractParas {
    fn nft_buy(&self, token_series_id: String, receiver_id: String);
}

#[near_bindgen]
impl Welcome {
    pub fn get_money_accrued(self) -> u128 {
        return self.money_accrued;
    }

    pub fn get_money_goal(self) -> u128 {
        return self.money_goal;
    }

    pub fn get_records(self) -> Vec<(String, u128)> {
        return self.records.to_vec();
    }

    // Check our records for a specific account id.
    // If account has already contributed, return the amount. If not, return 0.
    pub fn get_record(&self, account_id: &String) -> u128 {
        let record = self.records.get(&account_id);
        match record {
            None => 0,
            Some(number) => number,
        }
    }

    #[payable]
    pub fn pay_money(&mut self) {
        // Get current invocation details
        let account_id = env::signer_account_id();
        let deposit = env::attached_deposit();
        let current_account = env::current_account_id();

        // If the deposit was zero, we don't need to do anything and proceeding any further would be a no-op.
        if deposit == 0 {
            return;
        }

        // Increment our money accrued
        self.money_accrued += deposit;

        // Increment the account's record.
        self.records.insert(
            &account_id,
            &(deposit + Welcome::get_record(self, &account_id)),
        );

        // Check if we have reached enough funding to fulfill our goal.
        if self.money_accrued >= self.money_goal {
            //TODO: This causes gas fee errors.
            ext_contract_paras::nft_buy(
                TOKEN_ID.to_string(),
                current_account,
                // &'static_str
                &"paras-token-v2.testnet", // contract account id
                self.money_goal,           // yocto NEAR to attach
                SINGLE_CALL_GAS,           // gas to attach
            );
        }
    }
}