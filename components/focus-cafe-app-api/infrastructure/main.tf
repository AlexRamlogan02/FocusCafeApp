terraform {
  required_version = ">= 1.5.0"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.5"
    }
  }
}

data "aws_caller_identity" "current" {}

locals {
  api_definition      = yamldecode(file("${path.module}/../app/app-gw-api/focus-cafe-app-api.yaml"))
  dynamodb_table_name = var.dynamodb_table_name != "" ? var.dynamodb_table_name : "${var.project_name}-${var.environment}-main"

  http_methods = ["get", "post", "put", "patch", "delete"]

  endpoint_operations = flatten([
    for api_path, path_item in try(local.api_definition.paths, {}) : [
      for method in local.http_methods : {
        method    = upper(method)
        path      = api_path
        operation = path_item[method]
      } if can(path_item[method]) && can(path_item[method]["x-lambda-dir"]) && can(path_item[method]["x-handler"])
    ]
  ])

  endpoint_registry = {
    for endpoint in local.endpoint_operations :
    try(endpoint.operation["x-endpoint-key"], regexreplace(lower("${endpoint.method}_${endpoint.path}"), "[^a-z0-9_]", "_")) => {
      method           = endpoint.method
      path             = endpoint.path
      lambda_dir       = endpoint.operation["x-lambda-dir"]
      handler          = endpoint.operation["x-handler"]
      auth             = upper(try(endpoint.operation["x-auth"], "NONE"))
      timeout          = tonumber(try(endpoint.operation["x-timeout"], 30))
      memory_size      = tonumber(try(endpoint.operation["x-memory-size"], 512))
      required_scopes  = try(endpoint.operation["x-required-scopes"], [])
      dynamodb_actions = try(endpoint.operation["x-dynamodb-actions"], [])
      summary          = try(endpoint.operation.summary, try(endpoint.operation.operationId, endpoint.method))
    }
  }

  operation_key_lookup = {
    for key, endpoint in local.endpoint_registry : "${endpoint.method} ${endpoint.path}" => key
  }

  layer_registry = {
    shared_dynamo = {
      layer_name_suffix = "shared-dynamo"
      source_dir        = "${path.module}/../app/lambda_layer/shared_dynamo"
    }
    shared_logger = {
      layer_name_suffix = "shared-logger"
      source_dir        = "${path.module}/../app/lambda_layer/shared_logger"
    }
    shared_utils = {
      layer_name_suffix = "shared-utils"
      source_dir        = "${path.module}/../app/lambda_layer/shared_utils"
    }
  }

  cors_allow_origins_csv = join(",", var.cors_allowed_origins)
}

module "lambda_layers" {
  source   = "./modules/lambda_layer"
  for_each = local.layer_registry

  project_name      = var.project_name
  environment       = var.environment
  source_dir        = each.value.source_dir
  layer_name_suffix = each.value.layer_name_suffix
}

data "archive_file" "endpoint_lambda" {
  for_each = local.endpoint_registry

  type        = "zip"
  source_dir  = "${path.module}/../app/lambda/${each.value.lambda_dir}"
  output_path = "${path.module}/.build/${each.key}.zip"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "endpoint_lambda" {
  for_each = local.endpoint_registry

  name               = "${var.project_name}-${var.environment}-${each.key}-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "endpoint_lambda" {
  for_each = local.endpoint_registry

  statement {
    sid    = "CloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"]
  }

  statement {
    sid    = "CloudWatchMetrics"
    effect = "Allow"
    actions = [
      "cloudwatch:PutMetricData"
    ]
    resources = ["*"]
  }

  dynamic "statement" {
    for_each = length(each.value.dynamodb_actions) > 0 ? [1] : []

    content {
      sid     = "DynamoAccess"
      effect  = "Allow"
      actions = each.value.dynamodb_actions
      resources = [
        "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${local.dynamodb_table_name}",
        "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${local.dynamodb_table_name}/index/*"
      ]
    }
  }
}

resource "aws_iam_policy" "endpoint_lambda" {
  for_each = local.endpoint_registry

  name   = "${var.project_name}-${var.environment}-${each.key}-policy"
  policy = data.aws_iam_policy_document.endpoint_lambda[each.key].json
}

resource "aws_iam_role_policy_attachment" "endpoint_lambda" {
  for_each = local.endpoint_registry

  role       = aws_iam_role.endpoint_lambda[each.key].name
  policy_arn = aws_iam_policy.endpoint_lambda[each.key].arn
}

resource "aws_lambda_function" "endpoint_lambda" {
  for_each = local.endpoint_registry

  filename         = data.archive_file.endpoint_lambda[each.key].output_path
  source_code_hash = data.archive_file.endpoint_lambda[each.key].output_base64sha256
  function_name    = "${var.project_name}-${var.environment}-${each.key}"
  role             = aws_iam_role.endpoint_lambda[each.key].arn
  handler          = each.value.handler
  runtime          = "nodejs20.x"
  timeout          = each.value.timeout
  memory_size      = each.value.memory_size
  layers           = [for layer in module.lambda_layers : layer.layer_arn]

  environment {
    variables = {
      ENVIRONMENT          = var.environment
      DYNAMODB_TABLE_NAME  = local.dynamodb_table_name
      CORS_ALLOWED_ORIGINS = local.cors_allow_origins_csv
      SERVICE_NAME         = each.key
      METRICS_NAMESPACE    = "${var.project_name}-${var.environment}-api"
    }
  }
}

resource "aws_cloudwatch_log_group" "endpoint_lambda" {
  for_each = local.endpoint_registry

  name              = "/aws/lambda/${aws_lambda_function.endpoint_lambda[each.key].function_name}"
  retention_in_days = 14
}

locals {
  openapi_paths = {
    for api_path, path_item in try(local.api_definition.paths, {}) :
    api_path => merge(
      path_item,
      can(path_item.options) ? {
        options = merge(
          path_item.options,
          {
            "x-amazon-apigateway-integration" = try(path_item.options["x-amazon-apigateway-integration"], {
              type = "mock"
              requestTemplates = {
                "application/json" = "{\"statusCode\":200}"
              }
              responses = {
                default = {
                  statusCode = "200"
                  responseParameters = {
                    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,Authorization'"
                    "method.response.header.Access-Control-Allow-Methods"     = "'GET,POST,PUT,PATCH,DELETE,OPTIONS'"
                    "method.response.header.Access-Control-Allow-Origin"      = "'${length(var.cors_allowed_origins) == 0 ? "*" : var.cors_allowed_origins[0]}'"
                    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
                  }
                }
              }
            })
          }
        )
      } : {},
      {
        for method in local.http_methods :
        method => merge(
          path_item[method],
          {
            "x-amazon-apigateway-request-validator" = try(path_item[method]["x-amazon-apigateway-request-validator"], "all")
            "x-amazon-apigateway-integration" = merge(
              try(path_item[method]["x-amazon-apigateway-integration"], {}),
              {
                type                = "aws_proxy"
                httpMethod          = "POST"
                uri                 = aws_lambda_function.endpoint_lambda[local.operation_key_lookup["${upper(method)} ${api_path}"]].invoke_arn
                passthroughBehavior = "when_no_match"
              }
            )
          },
          upper(try(path_item[method]["x-auth"], "NONE")) == "COGNITO" ? {
            security = [
              {
                CognitoAuthorizer = try(path_item[method]["x-required-scopes"], [])
              }
            ]
          } : {}
        ) if can(path_item[method]) && can(path_item[method]["x-lambda-dir"]) && can(path_item[method]["x-handler"])
      }
    )
  }

  openapi_spec = {
    openapi = try(local.api_definition.openapi, "3.0.3")
    info    = try(local.api_definition.info, { title = "${var.project_name}-${var.environment}-api", version = "1.0.0" })
    paths   = local.openapi_paths
    components = merge(
      try(local.api_definition.components, {}),
      {
        securitySchemes = merge(
          try(local.api_definition.components.securitySchemes, {}),
          {
            CognitoAuthorizer = {
              type                           = "apiKey"
              name                           = "Authorization"
              in                             = "header"
              "x-amazon-apigateway-authtype" = "cognito_user_pools"
              "x-amazon-apigateway-authorizer" = {
                type         = "cognito_user_pools"
                providerARNs = [aws_cognito_user_pool.main.arn]
              }
            }
          }
        )
        schemas = merge(
          try(local.api_definition.components.schemas, {}),
          {
            StandardResponse = {
              type                 = "object"
              additionalProperties = false
              required             = ["success", "code", "message", "data", "meta"]
              properties = {
                success = { type = "boolean" }
                code    = { type = "string" }
                message = { type = "string" }
                data    = { type = "object" }
                meta    = { type = "object" }
              }
            }
          }
        )
        "x-amazon-apigateway-request-validators" = merge(
          try(local.api_definition.components["x-amazon-apigateway-request-validators"], {}),
          {
            all = {
              validateRequestBody       = true
              validateRequestParameters = true
            }
          }
        )
      }
    )
  }
}

resource "aws_api_gateway_rest_api" "main" {
  name = "${var.project_name}-${var.environment}-api"
  body = jsonencode(local.openapi_spec)
}

resource "aws_lambda_permission" "apigw" {
  for_each = local.endpoint_registry

  statement_id  = "AllowExecutionFromAPIGateway-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.endpoint_lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "main" {
  depends_on = [
    aws_lambda_permission.apigw
  ]

  rest_api_id = aws_api_gateway_rest_api.main.id

  triggers = {
    redeployment = sha1(jsonencode({
      spec       = local.openapi_spec
      lambda_arn = { for key, fn in aws_lambda_function.endpoint_lambda : key => fn.arn }
    }))
  }
}

resource "aws_api_gateway_stage" "main" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  deployment_id = aws_api_gateway_deployment.main.id
  stage_name    = var.environment

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_access.arn
    format = jsonencode({
      requestId = "$context.requestId"
      path      = "$context.resourcePath"
      method    = "$context.httpMethod"
      status    = "$context.status"
      latencyMs = "$context.responseLatency"
      sourceIp  = "$context.identity.sourceIp"
      userAgent = "$context.identity.userAgent"
      error     = "$context.error.message"
    })
  }
}

resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.main.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}-users"

  auto_verified_attributes = ["email"]

  username_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-${var.environment}-client"
  user_pool_id = aws_cognito_user_pool.main.id

  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

resource "aws_cloudwatch_log_group" "api_gateway_access" {
  name              = "/aws/apigateway/${var.project_name}-${var.environment}-access"
  retention_in_days = 14
}

resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "DEFAULT_4XX"
}

resource "aws_api_gateway_gateway_response" "default_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "DEFAULT_5XX"
}
