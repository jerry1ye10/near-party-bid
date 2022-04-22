var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const nearAPI = require("near-api-js");

const signerAccountId = process.env.account_id;
const signerPrivateKey = process.env.priv_key;

const signerKeyPair = nearAPI.utils.KeyPair.fromString(signerPrivateKey);
const keyStore = new nearAPI.keyStores.InMemoryKeyStore();

keyStore.setKey("default", signerAccountId, signerKeyPair);


exports.handler = async (event) => {
    // For every contract address in the Parties ddb table, invoke the hourlyCheck near contract function
    const parties = await ddb.scan({
        TableName: "Parties",
        ProjectionExpression: '#address',
        ExpressionAttributeNames: {
            '#address': 'Address'
        }
    }).promise();

    // Log into our near account
    const near = await nearAPI.connect({
        deps: {
            keyStore,
        },
        nodeUrl: "https://rpc.testnet.near.org",
        networkId: "default"
    });


    const account = await near.account(signerAccountId);

    const promises = parties.Items.map(async (party) => {
        let address = party.Address.S;
        console.log(`Invoking function for ${address}`);

        const functionCallResponse = await account.functionCall(
            address,
            process.env.check_method,
            {}
        );

        const result = nearAPI.providers.getTransactionLastResult(
            functionCallResponse
        );
        console.log("Result for " + address + ": " + result);
    });

    await Promise.all(promises);
}