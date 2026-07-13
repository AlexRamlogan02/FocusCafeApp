# Focus Cafe App API Application Code

This directory contains endpoint handlers and shared Lambda layer packages.

## Structure

- `lambda/<endpoint-dir>/<handler>.js` endpoint handlers
- `lambda_layer/shared_utils/nodejs` response and validation utilities
- `lambda_layer/shared_logger/nodejs` structured logging and metric helpers
- `lambda_layer/shared_dynamo/nodejs` DynamoDB helper functions

## Current Example Endpoint

- `lambda/get-app-data/getAppData.js` serves `GET /app-data`

## Local Development

Use SAM local to invoke handler logic with Docker without deploying AWS resources on every iteration.

```bash
sam local invoke GetAppDataFunction -t template.yaml
```

Use DynamoDB Local for local data testing and set endpoint/config env vars in your SAM env file.
