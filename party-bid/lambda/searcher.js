var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var documentClient = new AWS.DynamoDB.DocumentClient();

// This searches dynamodb for contracts matching the search term, or contracts belonging to a team
exports.handler = async (event) => {
    // Reject the request if theres no body
    if (!event.body) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            body: JSON.stringify({
                message: 'Missing body'
            })
        };
    }
    let json = JSON.parse(event.body)

    // If json.team is set, then we are searching for contracts belonging to a team using a dynamodb query
    // Otherwise, we are searching for contracts matching the search term using a dynamodb scan to check contracts containing the criteria
    let response;
    if (json.team) {
        var params = {
            TableName: "Parties",
            IndexName: "Team-index",
            KeyConditionExpression: "Team = :team",
            ExpressionAttributeValues: {
                ":team": json.team
            }
        };
        response = await documentClient.query(params).promise();
    } else if (json.search) {
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
        response = await documentClient.scan(params).promise();
    } else if (json.count) {
        // If the value of json.count is *, then return all the contracts
        if (json.count == "*") {
            var params = {
                TableName: "Parties"
            };
            response = await documentClient.scan(params).promise();
        } else {
            // Otherwise, return the first n contracts
            var params = {
                TableName: "Parties",
                Limit: json.count
            };
            response = await documentClient.scan(params).promise();
        }
    }
    else {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            body: JSON.stringify({
                "message": "An internal error occurred."
            })
        };
    }

    let thing = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify(response.Items)
    };
    return thing;
}
