var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var documentClient = new AWS.DynamoDB.DocumentClient();

// This searches dynamodb for contracts matching the search term, or contracts belonging to a team
exports.handler = async (event) => {
    let json = JSON.parse(event.body)

    // If json.team is set, then we are searching for contracts belonging to a team using a dynamodb query
    // Otherwise, we are searching for contracts matching the search term using a dynamodb scan to check contracts containing the criteria
    if (json.team) {
        var params = {
            TableName: "Parties",
            IndexName: "Team-index",
            KeyConditionExpression: "Team = :team",
            ExpressionAttributeValues: {
                ":team": json.team
            }
        };
    } else {
        var params = {
            TableName: "Parties",
            FilterExpression: "contains(#search, :search)",
            ExpressionAttributeNames: {
                "#search": "Address"
            },
            ExpressionAttributeValues: {
                ":search": json.search
            }
        };
    }

    let response = await (json.team ? documentClient.query(params).promise() : documentClient.scan(params).promise())
    let thing = {
        statusCode: 200,
        body: JSON.stringify(response.Items)
    };
    console.log(thing);
    return thing;
}

exports.handler({
    body: JSON.stringify({
        search: "memei"
    })
})