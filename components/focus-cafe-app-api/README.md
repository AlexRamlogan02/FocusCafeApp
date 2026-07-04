# Focus Cafe App API

This package contains the initial serverless REST API implementation and infrastructure scaffolding for Focus Cafe App.

## Endpoints

- POST /auth/register
- POST /auth/login
- GET /users/me
- PUT /users/me
- GET /users/me/streaks
- POST /users/me/streaks
- GET /users/me/history
- GET /app-data

## Infrastructure

The API infrastructure is organized under the infrastructure directory and includes:

- API Gateway
- Lambda function
- Cognito User Pool
- CloudWatch logging
- Terragrunt entrypoint for dev

## Missing inputs before deployment

Please provide the following if you want me to complete the deployment wiring:

- AWS account ID
- AWS region (default: us-east-1)
- GitHub repository owner/name
- Optional: custom domain name for the API
