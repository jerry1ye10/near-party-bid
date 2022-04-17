node compile.js
near delete simple-state.zepher.testnet zepher.testnet
near create-account simple-state.zepher.testnet --initialBalance 20 --masterAccount zepher.testnet
near deploy --accountId simple-state.zepher.testnet --wasmFile C:\Users\benac\IdeaProjects\near-party-bid\party-bid\contracts\party\target\wasm32-unknown-unknown\release\party.wasm --initFunction new --initArgs "{\"money_goal\": 100}"
near call simple-state.zepher.testnet get_money_goal --accountId zepher.testnet
near call simple-state.zepher.testnet get_money_accrued --accountId zepher.testnet
near call simple-state.zepher.testnet pay_money --deposit 10 --accountId zepher.testnet
near call simple-state.zepher.testnet get_money_accrued --accountId zepher.testnet