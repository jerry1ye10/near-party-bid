# 🌤️ Lambda Backend Functions
These functions are hosted in AWS Lambda and are responsible for the majority of our backend functionality.

Postman JSON documentation available here:
https://www.getpostman.com/collections/99a739e41fcad4b0ddb0

## 📜 Indexer
The indexer function is responsible for indexing contracts submitted by address
by the client when a contract is created. It matches the contract code hash and ensures
the contract is running our code. If this check passes, it's added along with the owning team address
to our DynamoDB table.

## ⏳ HourlyCheck
The hourly check function is responsible for running functions on all indexed contracts
in our table. It's designed to be hooked up to a cloudwatch cron job rule to run every hour
but can be customized to run on a different schedule and run different functions by changing the cron schedule and 
the check_method environment variable.

## 🔍 Searcher
The searcher function is responsible for searching for contracts in our DynamoDB table.
Contracts can be searched by exact team address, or partial or full contract address.
