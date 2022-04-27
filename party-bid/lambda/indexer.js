const https = require('https');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const defaultOptions = {
    host: 'rpc.testnet.near.org',
    path: '/',
    port: 443,
    headers: {
        'Content-Type': 'application/json',
    }
}

const post = (payload) => new Promise((resolve, reject) => {
    const options = { ...defaultOptions, method: 'POST' };
    const req = https.request(options, res => {
        let buffer = "";
        res.on('data', chunk => buffer += chunk)
        res.on('end', () => resolve(JSON.parse(buffer)))
    });
    req.on('error', e => reject(e.message));
    req.write(JSON.stringify(payload));
    req.end();
})

// If env.DEBUG_MODE is set, set debug mode to true
const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

// This function is responsible for taking http post requests, validating the contract submitted matches
// the correct hash for a valid party contract, and indexing them in a dynamodb table if they are valid.
exports.handler = async (event) => {
    // Ensure we have a body
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Bad Request',
                message: 'No body found in request'
            })
        }
    }

    let json = JSON.parse(event.body)

    // Ensure the json contains contract_id and team_id
    if (!json.contract_id || !json.team_id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing contract_id or team_id'
            })
        }
    }

    const
        body= {
            "jsonrpc": "2.0",
            "id": "dontcare",
            "method": "query",
            "params": {
                "request_type": "view_code",
                "finality": "final",
                "account_id": json.contract_id
            }
        };

    if (!DEBUG_MODE) {
        let resp = await post(body);
        // If the resp contains a key 'error' then the contract is invalid
        if (resp.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid contract'
                })
            }
        }

        // Now we know that the contract exists, check it's code hash located in resp.result.hash
        // If it matches the hash of the party contract, then we can index it in dynamodb
        if (resp.result.hash !== process.env.partyhash) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid contract'
                })
            }
        }
    }

    // If we've made it this far, then the contract is valid, and we can add it to dynamodb.
    // However, ensure we're not adding a duplicate contract.
    const params = {
        TableName: "Parties",
        Item: {
            'Address' : {S: json.contract_id},
            'Team' : {S: json.team_id}
        },
        ConditionExpression: 'attribute_not_exists(Address)'
    }

    try {
        let res = await ddb.putItem(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Contract Indexed'
            })
        }
    }
    catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Duplicate contract'
                })
            }
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Internal Server Error'
                })
            }
        }
    }
};