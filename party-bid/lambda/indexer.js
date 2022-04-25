const https = require('https'); // or https
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

// This function is responsible for taking http post requests, validating the contract submitted matches
// the correct hash for a valid party contract, and indexing them in a dynamodb table if they are valid.
exports.handler = async (event) => {
    let json = JSON.parse(event.body)
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

    // If we've made it this far, then the contract is valid, and we can add it to dynamodb.
    // If it already exists, then we'll just overwrite it and it's no big deal.
    const params = {
        TableName: "Parties",
        Item: {
            'Address' : {S: json.contract_id}
        }
    }

    await ddb.putItem(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Contract Indexed'
        })
    }
};