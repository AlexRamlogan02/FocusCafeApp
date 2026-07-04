# Focus Cafe App Deploy Role

This folder contains the IAM policy documents and Terraform bootstrap needed to create the GitHub Actions deploy role used by PomoBrew.

## Files

- `trust-policy.json`: reference copy of the GitHub Actions OIDC trust relationship
- `permissions-policy.json`: permissions for deploying the app infrastructure and UI
- `terraform/`: root Terraform module that creates and attaches the deploy role

## How to use

1. Run Terraform once from the `terraform/` folder to create the IAM role, OIDC provider, and policy.
2. Save the created role ARN in GitHub Secrets as `AWS_DEPLOY_ROLE_ARN`.
3. Let GitHub Actions assume the role for future deploys.

## Inputs you will need

- AWS account ID: `793451441607`
- AWS region: `us-east-1`
- GitHub repo: `AlexRamlogan02/FocusCafeApp`
