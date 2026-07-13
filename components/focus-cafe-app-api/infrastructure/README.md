# API Infrastructure

Terraform and Terragrunt configuration for the Focus Cafe API stack.

## Architecture

- OpenAPI endpoint and header definitions in `../app/app-gw-api/focus-cafe-app-api.yaml`
- Terraform reads OpenAPI `paths` and operation `x-` fields in [main.tf](main.tf)
- OpenAPI spec is imported into API Gateway after Terraform injects Lambda integrations
- One Lambda per endpoint under `../app/lambda/<endpoint-dir>`
- Three independent Lambda layers packaged from:
	- `../app/lambda_layer/shared_utils`
	- `../app/lambda_layer/shared_logger`
	- `../app/lambda_layer/shared_dynamo`
- Per-endpoint IAM policy generated from endpoint `dynamodb_actions`

## Current Example Endpoint

- `GET /app-data` via endpoint key `app_data_get`

## How to Add a New Endpoint

1. Add a path+method operation in `../app/app-gw-api/focus-cafe-app-api.yaml`
2. Add Terraform operation metadata fields on that operation:
	- `x-endpoint-key`
	- `x-lambda-dir`
	- `x-handler`
	- `x-auth`
	- `x-timeout`
	- `x-memory-size`
	- `x-required-scopes`
	- `x-dynamodb-actions`
3. Add responses/schemas for the operation in OpenAPI
4. (Optional) add/adjust `options` operation for path-specific CORS headers
5. Create handler file in `../app/lambda/<lambda_dir>/<handler-file>.js`
6. Run:

```bash
terraform fmt -recursive
terraform init -backend=false
terraform validate
```

No separate API Gateway resource blocks are needed. OpenAPI paths, lambda permissions, IAM, and deployment triggers are generated from the registry.
