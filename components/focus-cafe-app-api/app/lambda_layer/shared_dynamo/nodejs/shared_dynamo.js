const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const { createLogger } = require("/opt/nodejs/shared_logger");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const logger = createLogger(process.env.SERVICE_NAME || "shared-dynamo");
const tableName = process.env.DYNAMODB_TABLE_NAME || "focus-cafe-app-dev-main";

function sharedDynamo(docClient) {
  const getTableName = () => tableName;

  const dynamoGet = async (PK, SK, projectionExpression = null, consistentRead = false) => {
    try {
      const params = {
        TableName: tableName,
        Key: { PK, SK },
        ConsistentRead: consistentRead,
        ReturnConsumedCapacity: "TOTAL",
      };

      if (projectionExpression) {
        params.ProjectionExpression = projectionExpression;
      }

      const command = new GetCommand(params);
      const result = await docClient.send(command);

      logger.debug("Dynamo get success", { PK, SK, consistentRead });

      return result.Item || null;
    } catch (error) {
      logger.error("Dynamo get failed", { PK, SK, error: error.message });
      throw error;
    }
  };

  const dynamoPut = async (PK, SK, fields = {}) => {
    const item = { PK, SK, ...fields };

    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    try {
      const result = await docClient.send(command);
      logger.debug("Dynamo put success", { PK, SK });
      return result;
    } catch (error) {
      logger.error("Dynamo put failed", { PK, SK, error: error.message });
      throw error;
    }
  };

  const dynamoQuery = async (keyConditionExpression, expressionAttributeValues, indexName = null) => {
    const params = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ConsistentRead: false,
      ReturnConsumedCapacity: "TOTAL",
    };

    if (indexName) {
      params.IndexName = indexName;
    }

    try {
      const result = await docClient.send(new QueryCommand(params));
      logger.debug("Dynamo query success", { count: result.Count || 0 });
      return result.Items || [];
    } catch (error) {
      logger.error("Dynamo query failed", { error: error.message });
      throw error;
    }
  };

  const dynamoUpdate = async (PK, SK, updateExpression, expressionAttributeValues, expressionAttributeNames = {}) => {
    const params = {
      TableName: tableName,
      Key: { PK, SK },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    try {
      const result = await docClient.send(new UpdateCommand(params));
      logger.debug("Dynamo update success", { PK, SK });
      return result.Attributes;
    } catch (error) {
      logger.error("Dynamo update failed", { PK, SK, error: error.message });
      throw error;
    }
  };

  return {
    getTableName,
    dynamoGet,
    dynamoPut,
    dynamoQuery,
    dynamoUpdate,
  };
}

module.exports = {
  ...sharedDynamo(ddbDocClient),
  sharedDynamo,
};
