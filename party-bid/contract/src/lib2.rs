// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_contract_standards::fungible_token::metadata::{
    FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC,
};
use near_contract_standards::fungible_token::FungibleToken;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::ext_contract;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json;
use near_sdk::{
    env, near_bindgen, setup_alloc, AccountId, PanicOnDefault, Promise, PromiseOrValue,
    PromiseResult,
};

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Welcome {
    records: UnorderedMap<String, u128>,
    money_goal: String,
    money_accrued: u128,
    nft_id: String,
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
    sell_price_votes: UnorderedMap<String, u128>,
}
const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";
//Hashmap of accountname: money contributed
//Buy the nft when theres enough money
//distribute tokens based off the hashmap
//Once the nft is sold give money abased off token distribution

// impl Default for Welcome {
//   fn default() -> Self {
// Self {
//   records: UnorderedMap::new(b"a".to_vec()),
//   money_goal: Welcome::convert_near_to_yecto(2) as u128,
//   money_accrued: 0
// }
//   }
// }

// #[ext_contract(ext_self)]
// pub trait ExtSelf {
//     fn callback_promise_result(nft_id: String, money_goal: u128);
// }

// #[near_bindgen]
// impl Welcome{

//     #[private]
//     pub fn callback_promise_result(nft_id: String, money_goal: u128) {
//         match env::promise_result(0) {
//             PromiseResult::NotReady => unreachable!(),
//             PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
//             PromiseResult::Successful(val) => {
//                 //set a loca
//                 if let Ok(goal) = near_sdk::serde_json::from_slice::<String>(&val) {
//                   money_goal = goal.parse::<u128>().unwrap();
//                 } else {
//                     env::panic(b"ERR_WRONG_VAL_RECEIVED")
//                 }
//             },
//         }
//     }
// }

#[near_bindgen]
impl Welcome {
    #[init]
    pub fn new(money_goal: String, nft_id: String, name: String, symbol: String) -> Self {
        assert!(!env::state_exists(), "Already, initialized");
        let owner_id = env: current_account_id();
        let metadata = FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: name,
            symbol: symbol,
            icon: Some(DATA_IMAGE_SVG_NEAR_ICON.to_string()),
            reference: None,
            reference_hash: None,
            decimals: 24,
        };
        let mut this = Self {
            token: FungibleToken::new(b"a".to_vec()),
            metadata: LazyOption::new(b"m".to_vec(), Some(&metadata)),
            records: UnorderedMap::new(b"a".to_vec()),
            money_goal: money_goal,
            money_accrued: 0,
            nft_id: nft_id,
        };
        let total_supply = money_goal;
        this.token.internal_register_account(&owner_id);
        this.token.internal_deposit(&owner_id, total_supply.into());
        near_contract_standards::fungible_token::events::FtMint {
            owner_id: &owner_id,
            amount: &total_supply,
            memo: Some("Initial tokens supply is minted"),
        }
        .emit();
        this
    }
      
    }
}

impl Welcome {
    //static functions
    fn convert_near_to_yecto(near_amount: i128) -> i128 {
        return (near_amount * 1000000000000000000000000) as i128;
    }
}

const SINGLE_CALL_GAS: u64 = 30_000_000_000_000;

#[ext_contract(ext_contract_paras)]
trait ContractParas {
    fn nft_buy(&self, token_series_id: String, receiver_id: String);
    fn nft_get_series_price(&self, token_series_id: String) -> String;
}

#[near_bindgen]
impl Welcome {
    pub fn get_money_accrued(self) -> u128 {
        return self.money_accrued;
    }

    pub fn get_money_goal(self) -> u128 {
        return self.money_goal;
    }

    pub fn get_records(self) -> (Vec<String>, Vec<u128>) {
        let mut accounts = Vec::new();
        let mut tokens = Vec::new();
        for key in self.records.keys() {
            let copyKey = key.clone();
            accounts.push(key);
            let valEnum = self.records.get(&copyKey);
            match valEnum {
                Some(number) => tokens.push(number),
                None => tokens.push(0),
            }
        }
        return (accounts, tokens);
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
    fn ft_resolve_transfer(
        &mut self,
        sender_id: ValidAccountId,
        receiver_id: ValidAccountId,
        amount: u128
    )-> u128{
        //Logic to calculate new price of NFT to be sold 
            Iterate through dictionary of {owner: vote }
        //Logic to tell when owner of token transfers ownership their votes no longer matter 
            Dict -> {owner: vote} -> 
        //Logic to sell NFT when 75% has voted 
        //Give out money when nft has been sold 
    }
    //TODO: Implement get functions for token stuff 

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

        let token_id = &self.nft_id;

        // Check if we have reached enough funding to fulfill our goal.
        if self.money_accrued >= self.money_goal {
            ext_contract_paras::nft_buy(
                token_id.to_string(),
                current_account,
                // &'static_str
                &"paras-token-v2.testnet", // contract account id
                self.money_goal,           // yocto NEAR to attach
                SINGLE_CALL_GAS,           // gas to attach
            );
        }
        // TODO:refund if not bought
    }
}
