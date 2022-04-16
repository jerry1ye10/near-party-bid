use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json;
use near_sdk::{env, near_bindgen, setup_alloc, Promise};

setup_alloc!();

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct DeployArgs {
    money_goal: u128,
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

const CODE: &[u8] = include_bytes!("./greeter.wasm");



#[near_bindgen]
impl Factory {
    pub fn deploy(self, money_goal: u128) {
        let init_args = &DeployArgs { money_goal };

        Promise::new("dev-1649971938317-53315658254381".parse().unwrap())
            .create_account()
            .add_full_access_key(env::signer_account_pk())
            .transfer(1_000_000_000_000_000_000_000_0000)
            .deploy_contract(CODE.to_vec())
            .function_call(
                b"new".to_vec(),
                serde_json::to_vec(init_args).unwrap(),
                0,
                1_000_000_000_0000,
            );
    }
}
