# 🌤️ Lambda Backend Functions
These functions are hosted in AWS Lambda and are responsible for the majority of our backend functionality.

Postman JSON documentation available here:
https://www.getpostman.com/collections/99a739e41fcad4b0ddb0

## 📜 Indexer
The indexer function is responsible for indexing contracts submitted by address
by the client when a contract is created. It matches the contract code hash and ensures
the contract is running our code. If this check passes, it's added along with the owning team address
to our DynamoDB table.

POST https://vgge4rzeqq7f5r2it5rigga3240opjqp.lambda-url.us-east-1.on.aws/
<br>Content-Type: application/json
<br>Body: ```
{
"contract_id": "address_of_contrac22t",
"team_id": "id_of_team"
}```

## ⏳ HourlyCheck
The hourly check function is responsible for running functions on all indexed contracts
in our table. It's designed to be hooked up to a cloudwatch cron job rule to run every hour
but can be customized to run on a different schedule and run different functions by changing the cron schedule and 
the check_method environment variable.

## 🔍 Searcher
The searcher function is responsible for searching for contracts in our DynamoDB table.
Contracts can be searched by exact team address, or partial or full contract address.

POST https://ac6u4jq7nqkdhc5etgtz6pouhy0ognna.lambda-url.us-east-1.on.aws/
<br>Content-Type: application/json
<br>Body can be either: ```
{
"count": "10" OR "*"
}```
Or: ```
{
"team": "EXACT TEAM ID"
}```
Or: ```
{
"search": "PARTIAL OR FULL CONTRACT ADDRESS"
}```


