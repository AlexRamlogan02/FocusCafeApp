# API Infrastructure

Terraform and Terragrunt configuration for the PomoBrew API stack.

## Resources
- API Gateway REST API
- Lambda function
- Cognito User Pool
- CloudWatch log group

## Deployment notes
- Use Terragrunt from this directory to plan/apply the dev environment.
- Replace the placeholder Lambda zip packaging with a build step before deployment.
