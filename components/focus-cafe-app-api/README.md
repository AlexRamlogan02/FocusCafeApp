# Focus Cafe App API

This package contains the serverless REST API implementation and infrastructure scaffolding for Focus Cafe App.

## Runtime structure

- `lambdas/<endpoint-name>/<handlerFile>.js`: one folder per endpoint Lambda handler
- `layer/nodejs/utils/*`: shared Lambda layer utilities
- `infrastructure/api/*.openapi.yml.tftpl`: domain OpenAPI templates (source of truth)
- `infrastructure/modules/lambda_function`: reusable Lambda deploy module
- `infrastructure/modules/lambda`: reusable per-endpoint IAM module

## Current deployment model

- OpenAPI templates are rendered and merged in Terraform
- API Gateway REST API is created from the rendered OpenAPI body
- Each endpoint integrates with its own Lambda function
- Users endpoints are Cognito-authorized; auth and app-data are public
- API Gateway stage has access logs and method-level metrics/logging enabled

## Current endpoint contracts

- POST /auth/register
- POST /auth/login
- GET /users/{userId}
- PUT /users/{userId}
- GET /users/{userId}/streaks
- POST /users/{userId}/streaks
- GET /users/{userId}/history
- GET /app-data
