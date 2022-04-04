// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId, Promise};
use near_sdk::{ext_contract};
use near_sdk::collections::UnorderedMap;

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Welcome {
    records: UnorderedMap<String, u128>,
    money_goal: u128, 
    money_accrued: u128

}
//Hashmap of accountname: money contributed
//Buy the nft when theres enough money 
//distribute tokens based off the hashmap
//Once the nft is sold give money abased off token distribution 



impl Default for Welcome {
  fn default() -> Self {
    Self {
      records: UnorderedMap::new(b"a".to_vec()),
      money_goal: Welcome::convert_near_to_yecto(40) as u128,
      money_accrued: 0
    }
  }
}

impl Welcome{ //static functions
    fn convert_near_to_yecto(near_amount: i128) -> i128{
        return (near_amount * 1000000000000000000000000) as i128;
    }

}

const SINGLE_CALL_GAS: u64 = 200000000000000;
const token_id: &str = "298:5";

#[ext_contract(ext_contract_paras)]
trait ContractParas {
    fn nft_buy(&self, token_series_id: String, receiver_id: String); 
}





#[near_bindgen]
impl Welcome {

    pub fn get_money_accrued(self)-> u128{
        return self.money_accrued; 
    }

    pub fn get_money_goal(self)-> u128{
        return self.money_goal; 
    }

    pub fn get_records(self)-> (Vec<String>, Vec<u128>) {

        let mut accounts = Vec::new();
        let mut tokens = Vec::new();
        for key in self.records.keys(){
            let copyKey = key.clone();
            accounts.push(key);
            let valEnum = self.records.get(&copyKey);
            match valEnum{ 
                Some(number) => tokens.push(number),
                None => tokens.push(0)
            }
        }
        return (accounts, tokens);
    }

    pub fn get_record(&self, account_id: &String) -> u128{
        let record =  self.records.get(&account_id); 
        match record{
            None => 0,
            Some(number) =>  number,
        }

    }


    #[payable]
    pub fn pay_money(&mut self){
        let account_id = env::signer_account_id(); 
        let deposit = env::attached_deposit();
        let current_account = env::current_account_id();
        self.money_accrued += deposit;
        self.records.insert(&account_id, &(deposit + Welcome::get_record(self, &account_id)));
        if self.money_accrued > self.money_goal {
            ext_contract_paras::nft_buy(
                token_id.to_string(),
                current_account, 
                // &'static_str
                &"paras-token-v2.testnet", // contract account id
                Welcome::convert_near_to_yecto(1) as u128, // yocto NEAR to attach
                SINGLE_CALL_GAS // gas to attach
            );
            
        }
    }
}



/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn set_then_get_greeting() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Welcome::default();
        contract.set_greeting("howdy".to_string());
        assert_eq!(
            "howdy".to_string(),
            contract.get_greeting("bob_near".to_string())
        );
    }

    #[test]
    fn get_default_greeting() {
        let context = get_context(vec![], true);
        testing_env!(context);
        let contract = Welcome::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            "Hello".to_string(),
            contract.get_greeting("francis.near".to_string())
        );
    }
}
