// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_contract_standards::fungible_token::metadata::{FungibleTokenMetadata, FungibleTokenMetadataProvider, FT_METADATA_SPEC};
use near_contract_standards::fungible_token::FungibleToken;
use near_contract_standards::fungible_token::core::{
    FungibleTokenCore,
};
use near_sdk::utils::assert_one_yocto;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::collections::LazyOption;
use near_sdk::ext_contract;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json;
use near_sdk::json_types::ValidAccountId;
use near_sdk::json_types::U128;
use near_sdk::collections::LookupMap;
use near_sdk::{
    env, near_bindgen, log, setup_alloc, AccountId, Balance, Promise, PromiseOrValue, Gas, 
    PromiseResult,
};
//Add panic on default later
use near_contract_standards::non_fungible_token::{Token, TokenId};

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
//ADD PANICONDEFAULT BELOW TODO
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct PartyContract {
    team_name: String,
    records: UnorderedMap<String, u128>,
    money_goal: u128,
    money_accrued: u128,
    nft_account_id: String, 
    nft_id: String,
    host: AccountId,
    token: FungibleToken,
    metadata: LazyOption<FungibleTokenMetadata>,
    votes: UnorderedMap<String, u128>,
    nft_bought: bool, 
    listing_available: bool,
    nft_sold: bool,
    party_lost: bool,
}


const DATA_IMAGE_SVG_NEAR_ICON: &str = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288 288'%3E%3Cg id='l' data-name='l'%3E%3Cpath d='M187.58,79.81l-30.1,44.69a3.2,3.2,0,0,0,4.75,4.2L191.86,103a1.2,1.2,0,0,1,2,.91v80.46a1.2,1.2,0,0,1-2.12.77L102.18,77.93A15.35,15.35,0,0,0,90.47,72.5H87.34A15.34,15.34,0,0,0,72,87.84V201.16A15.34,15.34,0,0,0,87.34,216.5h0a15.35,15.35,0,0,0,13.08-7.31l30.1-44.69a3.2,3.2,0,0,0-4.75-4.2L96.14,186a1.2,1.2,0,0,1-2-.91V104.61a1.2,1.2,0,0,1,2.12-.77l89.55,107.23a15.35,15.35,0,0,0,11.71,5.43h3.13A15.34,15.34,0,0,0,216,201.16V87.84A15.34,15.34,0,0,0,200.66,72.5h0A15.35,15.35,0,0,0,187.58,79.81Z'/%3E%3C/g%3E%3C/svg%3E";
//Hashmap of accountname: money contributed
//Buy the nft when theres enough money
//distribute tokens based off the hashmap
//Once the nft is sold give money abased off token distribution


const TRANSACTION_FEE: f64 = 0.01;

impl Default for PartyContract {
  fn default() -> Self {
    PartyContract::new("2000000000000000000000000".to_string(), "704".to_string(), "jerry_team".to_string(), "jerry".to_string(), "jerry".to_string(), "paras-token-v2.testnet".to_string(), env::signer_account_id())
  }
}

#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn confirm_nft_callback(nft_id: String, #[callback] token_id : TokenId);
    fn confirm_nft_callback2(#[callback] token: Option<Token>);
    fn confirm_nft_price_callback(#[callback] price: String);
}

#[near_bindgen]
impl FungibleTokenCore for PartyContract{

    fn ft_balance_of(&self, account_id: AccountId) -> U128 { 
        return self.token.accounts.get(&account_id).unwrap().into();
     }

    fn ft_total_supply(&self) -> U128 { 

        return self.token.total_supply.into();
     }

     #[payable]
    fn ft_transfer_call(&mut self, receiver_id: AccountId, amount: U128, memo: std::option::Option<std::string::String>, msg: std::string::String) -> PromiseOrValue<U128> { 
        if !(&self.token.accounts.contains_key(&receiver_id)){
            &self.token.internal_register_account(&receiver_id);
        }
        self.token.ft_transfer_call(receiver_id, amount, memo, msg)

     }

     #[payable]
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: std::option::Option<std::string::String>) { 
        assert_one_yocto();
        if !(&self.token.accounts.contains_key(&receiver_id)){
            &self.token.internal_register_account(&receiver_id);
        }
        self.token.ft_transfer(receiver_id, amount.into(), memo);
     }

}

//near_contract_standards::impl_fungible_token_core!(PartyContract, token, on_tokens_burned);
near_contract_standards::impl_fungible_token_storage!(PartyContract, token, on_account_closed);

#[near_bindgen]
impl FungibleTokenMetadataProvider for PartyContract {
    fn ft_metadata(&self) -> FungibleTokenMetadata {
        self.metadata.get().unwrap()
    }
}

#[near_bindgen]
impl PartyContract{


    fn on_account_closed(&mut self, account_id: AccountId, balance: Balance) {
        log!("Closed @{} with {}", account_id, balance);
    }

    fn on_tokens_burned(&mut self, account_id: AccountId, amount: Balance) {
        log!("Account @{} burned {}", account_id, amount);
    }

    

    // #[private]
    // pub fn callback_promise_result(nft_id: String, money_goal: u128) {
    //     match env::promise_result(0) {
    //         PromiseResult::NotReady => unreachable!(),
    //         PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
    //         PromiseResult::Successful(val) => {
    //             //set a loca
    //             if let Ok(goal) = near_sdk::serde_json::from_slice::<String>(&val) {
    //               money_goal = goal.parse::<u128>().unwrap();
    //             } else {
    //                 env::panic(b"ERR_WRONG_VAL_RECEIVED")
    //             }
    //         },
    //     }
    // }
}

#[near_bindgen]
impl PartyContract {
    #[init]
    pub fn new(money_goal: String, nft_id: String, team_name:String, name: String, symbol: String, nft_account_id: String, host:AccountId) -> Self {
        assert!(!env::state_exists(), "Already, initialized");
        let owner_id = env::current_account_id();
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
            team_name: team_name,
            token: FungibleToken::new(b"a".to_vec()),
            metadata: LazyOption::new(b"m".to_vec(), Some(&metadata)),
            records: UnorderedMap::new(b"a".to_vec()),
            money_goal: (((money_goal.parse::<u128>().unwrap() as f64) * (1.0 + TRANSACTION_FEE)) as u128) ,
            money_accrued: 0,
            nft_id: nft_id,
            host: host,
            votes: UnorderedMap::new(b"c".to_vec()),
            nft_bought: false, 
            listing_available: false,
            nft_sold: false,
            nft_account_id: nft_account_id,
            party_lost: false
        };
        let total_supply : U128 = U128::from((((money_goal.parse::<u128>().unwrap() as f64) * (1.0 + TRANSACTION_FEE)) as u128));
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

impl PartyContract {
    //static functions
    fn convert_near_to_yecto(near_amount: i128) -> i128 {
        return (near_amount * 1000000000000000000000000) as i128;
    }
}

const SINGLE_CALL_GAS: Gas = Gas{0: 500_000_000_000_00};

#[ext_contract(ext_contract_paras)]
trait ContractParas {
    fn nft_buy(&self, token_series_id: String, receiver_id: String);
    fn nft_get_series_price(&self, token_series_id: String) -> String;
    fn nft_token(&self, token_id: String) -> Option<Token>; 
    fn nft_approve(
        &mut self, 
        token_id: TokenId, 
        account_id: String, 
        msg: Option<String>
    ) -> Option<Promise>;
    fn nft_transfer(
        &mut self,
        receiver_id: ValidAccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    );
}



#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TeamMetadata {
    team_name: String,
    token_metadata: FungibleTokenMetadata,
    host: AccountId
}


#[near_bindgen]
impl PartyContract {
    pub fn get_money_accrued(self) -> u128 {
        return self.money_accrued;
    }

    pub fn get_money_goal(self) -> u128 {
        return self.money_goal;
    }
    pub fn get_nft_id(self) -> String {
        return self.nft_id;
    }
    pub fn get_team_metadata(self) -> TeamMetadata {
        return TeamMetadata {
            team_name: self.team_name,
            token_metadata: self.metadata.get().unwrap(),
            host: self.host,
        }
    }
    pub fn get_team_name(self) -> String {
        return self.team_name
    }

    pub fn get_token_data(self) -> FungibleTokenMetadata {
        return self.metadata.get().unwrap()
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

    pub fn get_records_count(self) -> u8{
        return self.records.keys().count() as u8;
    }
    pub fn get_status(self) -> String{
    if self.nft_sold{
        return "NFT has been bought and sold!".to_string();
    }
    if self.listing_available{
        return "Currently being sold".to_string();
    }
    if self.nft_bought{
        return "Currently Voting on Price".to_string();
    }
    if self.party_lost{
        return "Party Lost".to_string();
    }
    return "Party Ongoing".to_string();
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

    pub fn get_records_count(self) -> u8{
        return self.records.keys().count() as u8;
    }
    pub fn get_status(self) -> String{
    if self.nft_sold{
        return "NFT has been bought and sold!".to_string();
    }
    if self.listing_available{
        return "Currently being sold".to_string();
    }
    if self.nft_bought{
        return "Currently Voting on Price".to_string();
    }
    if self.party_lost{
        return "Party Lost".to_string();
    }
    return "Party Ongoing".to_string();
    }
    //Two cases: Peer to peer, and contract to peer 
    // fn ft_resolve_transfer(
    //     &mut self,
    //     sender_id: ValidAccountId,
    //     receiver_id: ValidAccountId,
    //     amount: u128
    // )-> u128{
    //     return 0
    //     //Logic to calculate new price of NFT to be sold 
    //         //Iterate through dictionary of {owner: vote }
    //     //Logic to tell when owner of token transfers ownership their votes no longer matter 
    //        // Dict -> {owner: vote} -> 
    //     //Logic to sell NFT when 75% has voted 
    //     //Give out money when nft has been sold 
    // }

    pub fn get_vote_price(&self, account_id: &String) -> u128 {
        let record = self.votes.get(&account_id);
        match record {
            None => 0,
            Some(number) => number,
        }
    }


    pub fn get_vote_prices(&self) -> (Vec<String>, Vec<u128>) {
        let mut accounts = Vec::new();
        let mut tokens = Vec::new();
        for key in self.votes.keys() {
            let copyKey = key.clone();
            accounts.push(key);
            let valEnum = self.votes.get(&copyKey);
            match valEnum {
                Some(number) => tokens.push(number),
                None => tokens.push(0),
            }
        }
        return (accounts, tokens);
    }
    //TODO Check for whether the NFT is bought or not 

    #[private] //Code to list on paras 
    fn approve_nft(&mut self){
        let current_account = env::current_account_id();
            let nft_account_id: AccountId = self.nft_account_id.parse().unwrap();
            log!("listing now! {}", current_account);
            // ext_contract_paras::nft_approve(
            //    self.nft_id.to_string(), //NEED TO CHANGE THIS 
            //    "paras-marketplace-v2.testnet".to_string(),
            //     Some("{\"price\":\"15000000000000000000000000\",\"market_type\":\"sale\",\"ft_token_id\":\"near\"}".to_string()),
            //     nft_account_id,
            //     400000000000000000000,           // yocto NEAR to attach
            //     SINGLE_CALL_GAS,); 
    }

    #[payable]
    pub fn set_vote_price(&mut self, price: String){
        assert!(!self.nft_sold);
        assert!(self.nft_bought);
        let deposit = env::attached_deposit();
        let account_id = env::signer_account_id();
        let vote_price = price.parse::<u128>().unwrap();
        self.votes.insert(
            &account_id.to_string(),
            &vote_price,
        );

        let mut total_token_count = 0; 
        for key in self.votes.keys() {
            let copyKey: AccountId = key.clone().parse().unwrap();
            let token_count: u128 = self.token.accounts.get(&copyKey).unwrap();
            total_token_count += token_count;
        }
        if ((total_token_count as f64 / self.money_goal as f64) >= 0.75) {
            let current_account = env::current_account_id();
            let nft_account_id: AccountId = self.nft_account_id.parse().unwrap();
            log!("listing now! {}", current_account);
            self.listing_available = true; 
            //self.approve_nft();        // gas to attach
            // ).then(
            //     ext_self::confirm_nft_callback(token_id.to_string(), current_account, 0, SINGLE_CALL_GAS * 3)
            // );

        }

    }

    pub fn get_percent_voted(&self) -> f64 {
        let mut total_token_count = 0; 
        for key in self.votes.keys() {
            let copyKey: AccountId = key.clone().parse().unwrap();
            let token_count: u128 = self.token.accounts.get(&copyKey).unwrap();
            total_token_count += token_count;
        } 
        return (total_token_count as f64 / self.money_goal as f64)
    }

    pub fn get_listing_available(&self) -> bool{
        return self.listing_available; 
    }

    #[payable]
    pub fn buy_nft(&mut self){
        let nft_account_id: AccountId = self.nft_account_id.parse().unwrap();
        assert!(self.listing_available);
        assert!(self.nft_bought);
        assert!(!self.nft_sold);
        let price = self.get_sell_price();
        let deposit = env::attached_deposit();
        assert!(deposit >= price);
        let account_id = env::current_account_id();
        let signer_id = env::signer_account_id(); 
        let nft_id = &self.nft_id.clone();
        ext_contract_paras::nft_transfer(signer_id, nft_id.to_string(), None, None, nft_account_id, 1, SINGLE_CALL_GAS);
        self.nft_sold = true; 

    }

    #[payable]
    pub fn claim_money(&mut self){
        assert!(self.nft_sold);
        assert_one_yocto();
        let account_id = env::current_account_id();

        let token_count = self.get_token_count(account_id.clone());
        let money_amount = token_count * (self.get_sell_price() / self.money_goal);


        self.token.ft_transfer(account_id, token_count.into(), None);
        Promise::new(env::current_account_id()).transfer(money_amount);


    }

    pub fn get_sell_price(&self) -> u128{
        let mut sell_price = 0;
        let mut total_token_count = 0; 
        for key in self.votes.keys() {
            let copyKey: AccountId = key.clone().parse().unwrap();
            let token_count: u128 = self.token.accounts.get(&copyKey).unwrap();
            let vote_price: u128 = self.votes.get(&key.to_string()).unwrap();
            sell_price += ((vote_price as f64 / self.money_goal as f64) * token_count as f64) as u128;
            total_token_count += token_count;
        }

        sell_price += (self.money_goal - total_token_count);
        return sell_price; 
    }

    pub fn get_token_supply(&self) -> u128{
        return self.token.total_supply;
    }

    pub fn get_token_count(&self, account_id: AccountId) -> u128{
        let val = self.token.accounts.get(&account_id);
        match val {
            Some(v) => v,
            None => 0,
        }
    }

    //TODO: 
    //Write a function that will refund out money to people using records (just take 1%)
    //
//  Need a function to run this on the contract 
// - Will call when you're about to pay 
// - Backend will also default call it 
// - Need to take a fee to account for the gas price of this OR force users to call this... 
// - Eh I'd rather just take a fee 

    #[payable]
    pub fn refund_party(&mut self){
        assert_one_yocto();
        assert!(!self.nft_bought);
        let nft = &self.nft_id;
        let nft_account_id: AccountId = self.nft_account_id.parse().unwrap();
        ext_contract_paras::nft_get_series_price(nft.to_string(), nft_account_id, 0, SINGLE_CALL_GAS ).then(
            ext_self::confirm_nft_price_callback(env::current_account_id(), 0, SINGLE_CALL_GAS)
        );

    //      const response = await window.parasContract.nft_get_series_price({
    //   token_series_id: nftId,
    // });
        //Check for price of the NFT 
        //delete the contract Promise::new(contract_id).delete_account(beneficiary_id);

    }




    #[private]
    pub fn airdrop_tokens(&mut self){
        let sender_id = env::current_account_id();
        log!(env::signer_account_id());
        log!("Starting airdrop");
        for key in self.records.keys() {
            let copyKey: AccountId = key.clone().parse().unwrap();
            let valEnum = self.records.get(&key);
            match valEnum {
                Some(token_count) => {
                    log!("{} poop", token_count);
                    self.token.internal_register_account(&copyKey);
                    self.token.internal_transfer(&sender_id, &copyKey, token_count, None);
                }
                None =>  log!("no valid value"),
            }
        }
        //Look at the records vec to airdrop tokens once the thing is bought 
        //On transfer should do everything else 
    }




    pub fn refund_money(&mut self, amount: String){
        assert!(!self.nft_bought, "NFT has been bought already");
        let refund_amount = amount.parse::<u128>().unwrap();
        let caller_id = env::signer_account_id();
        let record_amount = PartyContract::get_record(self, &caller_id.to_string());
        assert!(record_amount >= refund_amount);
        self.records.insert(
            &caller_id.to_string(),
            &(record_amount - refund_amount),
        );
        Promise::new(env::current_account_id()).transfer(refund_amount);
    }

    #[private]
    pub fn confirm_nft_callback(&mut self, nft_id: String, #[callback] token_id : TokenId){
        let current_account = env::current_account_id();
        let current_account2 = env::current_account_id();
        log!(env::signer_account_id());
        let nft_account_id: AccountId = self.nft_account_id.parse().unwrap();
        self.nft_id = token_id.clone();
        ext_contract_paras::nft_token(token_id, nft_account_id, 0, SINGLE_CALL_GAS).then(
            ext_self::confirm_nft_callback2(current_account2, 0, SINGLE_CALL_GAS)
        );
    }   
    
    #[private]
    pub fn confirm_nft_price_callback(&mut self, #[callback] price: String){
        log!(price);
        let current_price = (((price.parse::<u128>().unwrap() as f64) * (1.0 + TRANSACTION_FEE)) as u128); 
        if current_price != self.money_goal{
            for key in self.records.keys() {
                let copyKey: AccountId = key.clone().parse().unwrap();
                let refund_amount = self.records.get(&key);
                match refund_amount {
                    Some(refund) => {
                        Promise::new(copyKey).transfer(((refund as f64) * 0.99) as u128 ); //Takes a 1% transaction fee to account for gas
                        self.party_lost = true; 
                    }
                    None =>  log!("no valid value"),
                }
                
            }
        }
    }

    #[private]
    pub fn confirm_nft_callback2(&mut self, #[callback] token: Option<Token>){
        let current_account = env::current_account_id();
        
        match token {
            // The division was valid
            Some(t) => if t.owner_id == current_account{
                log!("{} bigschlong {}", t.owner_id, current_account);
                self.nft_bought = true;
                self::airdrop_tokens();
                //TODO Transfer tokens 
            }
            else{
                //log!("{} smallSchlong {}", t.owner_id, current_account);

            },
            // The division was invalid
            None  => env::panic(b"Does not own NFT"), //Todo: need to terminate party in this case 

        }
    }

    pub fn get_nft_bought(&self)-> bool{ 
        return self.nft_bought;
    }
    
    pub fn get_nft_sold(&self)-> bool{ 
        return self.nft_sold;
    }


    
    #[payable]
    pub fn pay_money(&mut self) {
        // Get current invocation details
        let account_id = env::signer_account_id();
        let deposit = env::attached_deposit();
        let mut final_deposit = 0;
        let current_account = env::current_account_id();
        if deposit == 0 {
            return;
        }
        self.money_accrued += deposit;
        if(self.money_accrued >= self.money_goal){
            final_deposit = self.money_accrued - self.money_goal;
            self.money_accrued = self.money_goal;
            Promise::new(env::signer_account_id()).transfer(final_deposit);
        }
        self.records.insert(
            &account_id.to_string(),
            &(deposit-final_deposit + PartyContract::get_record(self, &account_id.to_string())),
        );
        log!("test {} {} {} {} {}", deposit, final_deposit, self.money_accrued, self.money_goal, deposit-final_deposit );
       
        let token_id = &self.nft_id;

        let nft_account_id: AccountId = self.nft_account_id.parse().unwrap();
        
        if self.money_accrued >= self.money_goal {
            ext_contract_paras::nft_buy(
                token_id.to_string(),
                current_account.to_string(),
                // &'static_str
                nft_account_id, // contract account id
                self.money_goal,           // yocto NEAR to attach
                SINGLE_CALL_GAS*2,           // gas to attach
            ).then(
                ext_self::confirm_nft_callback(token_id.to_string(), current_account, 0, SINGLE_CALL_GAS * 3)
            );
        }

        

        // TODO:refund NFT if not bought
        // TODO: refund if nft-id does not exist
    }
}
