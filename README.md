# Focus Cafe App

This repository contains the full serverless architecture for Focus Cafe App.

## Components

- focus-cafe-app-ui: React SPA frontend
- focus-cafe-app-api: Lambda handlers and API Gateway/Terragrunt infrastructure
- focus-cafe-app-db: DynamoDB Terraform/Terragrunt infrastructure

## Planned AWS services

- S3 + CloudFront for frontend hosting
- Cognito for email/password authentication
- API Gateway + Lambda for REST APIs
- DynamoDB for single-table app and user data
- CloudWatch for logging and metrics
- GitHub Actions + Terraform + Terragrunt for deployment
