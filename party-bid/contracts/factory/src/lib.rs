use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json;
use near_sdk::{env, near_bindgen, setup_alloc, Promise, Gas, AccountId};

setup_alloc!();


#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct DeployArgs {
    money_goal: String,
    nft_id: String,
    team_name: String,
    name: String, 
    symbol: String,
    nft_account_id: String,
    host: AccountId
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Factory;

impl Default for Factory {
  fn default() -> Self {
    Self {

    }
  }
}

const CODE: &[u8] = include_bytes!("./party.wasm");



#[near_bindgen]
impl Factory {

    pub fn deploy(self, money_goal: String, nft_id: String, current_time: String , team_name:String, token_name:String, token_symbol:String) -> String {
        let mut account_id: String = "dev-party-12345678912345678".to_string();
        account_id.push_str(&current_time);
        let init_args = &DeployArgs { money_goal: money_goal, nft_id: nft_id, team_name: team_name.to_string(), name: token_name.to_string(), symbol: token_symbol.to_string(), nft_account_id: "paras-token-v2.testnet".to_string(), host: env::signer_account_id()};

        let gas: Gas = 75000000000000.into();

        Promise::new(account_id.parse().unwrap())
            .create_account()
            .add_full_access_key(env::signer_account_pk())
            .transfer(2_000_000_000_000_000_000_000_0000)
            .deploy_contract(CODE.to_vec())
            .function_call(
                "new".to_string(),
                serde_json::to_vec(init_args).unwrap(),
                0,
                gas,
            ).then(
              return account_id.to_string()
            );
    }
}
