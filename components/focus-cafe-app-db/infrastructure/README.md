# Database Infrastructure

Terraform and Terragrunt configuration for the PomoBrew database layer.

## Resources
- DynamoDB table for single-table app and user data

## Deployment notes
- Use Terragrunt from this directory to plan/apply the dev environment.
- The table is currently configured for a simple single-table pattern using pk/sk.
