# Focus Cafe App Hosting

This component contains the Terraform scaffolding for low-cost frontend hosting for PomoBrew.

## Resources

- S3 bucket for frontend assets
- CloudFront distribution with default certificate
- Origin access control and S3 bucket policy

## Outputs

- `frontend_bucket_name`
- `cloudfront_distribution_id`
- `cloudfront_domain_name`

## Notes

- This uses the default CloudFront domain for the lowest-cost setup.
- After apply, copy the bucket and distribution outputs into GitHub secrets.
- For GitHub Actions, add the repository secret `AWS_ACCOUNT_ID`.
- For local Terragrunt runs, export `AWS_ACCOUNT_ID` before planning/applying.
