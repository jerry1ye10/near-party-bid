const https = require('https'); // or https

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
    const
        body= {
            "jsonrpc": "2.0",
            "id": "dontcare",
            "method": "query",
            "params": {
                "request_type": "view_code",
                "finality": "final",
                "account_id": event.contract_id
            }
        };

    let resp = await post(body);

    return response;
};

exports.handler({
    contract_id: 'dev-1650299149015-25598058530011'
});