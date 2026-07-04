terraform {
  required_version = ">= 1.5.0"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

data "aws_caller_identity" "current" {}

locals {
  dynamodb_table_name = var.dynamodb_table_name != "" ? var.dynamodb_table_name : "${var.project_name}-${var.environment}-main"

  endpoint_lambdas = {
    auth_register = {
      lambda_dir   = "auth-register"
      handler_file = "authRegister"
      ddb_actions  = []
    }
    auth_login = {
      lambda_dir   = "auth-login"
      handler_file = "authLogin"
      ddb_actions  = []
    }
    users_get = {
      lambda_dir   = "users-get"
      handler_file = "usersGet"
      ddb_actions  = ["dynamodb:GetItem"]
    }
    users_put = {
      lambda_dir   = "users-put"
      handler_file = "usersPut"
      ddb_actions  = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
    }
    users_streaks_get = {
      lambda_dir   = "users-streaks-get"
      handler_file = "usersStreaksGet"
      ddb_actions  = ["dynamodb:Query"]
    }
    users_streaks_post = {
      lambda_dir   = "users-streaks-post"
      handler_file = "usersStreaksPost"
      ddb_actions  = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
    }
    users_history_get = {
      lambda_dir   = "users-history-get"
      handler_file = "usersHistoryGet"
      ddb_actions  = ["dynamodb:Query"]
    }
    app_data_get = {
      lambda_dir   = "app-data-get"
      handler_file = "appDataGet"
      ddb_actions  = ["dynamodb:GetItem", "dynamodb:Query"]
    }
  }
}

module "lambda_iam" {
  source = "./modules/lambda"

  for_each = local.endpoint_lambdas

  project_name         = var.project_name
  environment          = var.environment
  endpoint_name        = each.key
  aws_region           = var.aws_region
  aws_account_id       = data.aws_caller_identity.current.account_id
  dynamodb_table_name  = local.dynamodb_table_name
  dynamodb_permissions = each.value.ddb_actions
}

module "lambda_layer" {
  source = "./modules/lambda_layer"

  project_name = var.project_name
  environment  = var.environment
  source_dir   = "${path.module}/../layer"
}

module "lambda_functions" {
  for_each = local.endpoint_lambdas

  source = "./modules/lambda_function"

  function_name = "${var.project_name}-${var.environment}-${each.value.lambda_dir}"
  source_dir    = "${path.module}/../lambdas/${each.value.lambda_dir}"
  role_arn      = module.lambda_iam[each.key].role_arn
  handler       = "${each.value.handler_file}.handler"

  layers = [module.lambda_layer.layer_arn]

  environment_variables = {
    ENVIRONMENT         = var.environment
    CORS_ALLOWED_ORIGIN = var.cors_allowed_origin
    IDEMPOTENCY_ENABLED = "true"
    DYNAMODB_TABLE_NAME = local.dynamodb_table_name
  }
}

locals {
  auth_openapi = yamldecode(templatefile("${path.module}/api/auth.openapi.yml.tftpl", {
    auth_register_invoke_arn = module.lambda_functions["auth_register"].invoke_arn
    auth_login_invoke_arn    = module.lambda_functions["auth_login"].invoke_arn
    cors_allowed_origin      = var.cors_allowed_origin
  }))

  users_openapi = yamldecode(templatefile("${path.module}/api/users.openapi.yml.tftpl", {
    users_get_invoke_arn          = module.lambda_functions["users_get"].invoke_arn
    users_put_invoke_arn          = module.lambda_functions["users_put"].invoke_arn
    users_streaks_get_invoke_arn  = module.lambda_functions["users_streaks_get"].invoke_arn
    users_streaks_post_invoke_arn = module.lambda_functions["users_streaks_post"].invoke_arn
    users_history_get_invoke_arn  = module.lambda_functions["users_history_get"].invoke_arn
    cors_allowed_origin           = var.cors_allowed_origin
  }))

  app_data_openapi = yamldecode(templatefile("${path.module}/api/app-data.openapi.yml.tftpl", {
    app_data_get_invoke_arn = module.lambda_functions["app_data_get"].invoke_arn
    cors_allowed_origin     = var.cors_allowed_origin
  }))

  openapi_spec = {
    openapi = "3.0.3"
    info = {
      title   = "${var.project_name}-${var.environment}-api"
      version = "1.0.0"
    }
    paths = merge(
      local.auth_openapi.paths,
      local.users_openapi.paths,
      local.app_data_openapi.paths
    )
    components = {
      securitySchemes = {
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
      schemas = {
        StandardResponse = {
          type = "object"
          properties = {
            success = { type = "boolean" }
            code    = { type = "string" }
            message = { type = "string" }
            data    = { type = "object" }
            meta    = { type = "object" }
          }
        }
      }
      "x-amazon-apigateway-request-validators" = {
        all = {
          validateRequestBody       = true
          validateRequestParameters = true
        }
      }
    }
  }
}

resource "aws_api_gateway_rest_api" "main" {
  name = "${var.project_name}-${var.environment}-api"
  body = jsonencode(local.openapi_spec)
}

resource "aws_lambda_permission" "apigw" {
  for_each = module.lambda_functions

  statement_id  = "AllowExecutionFromAPIGateway-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
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
      lambda_arn = { for key, lambda in module.lambda_functions : key => lambda.arn }
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
      requestId        = "$context.requestId"
      sourceIp         = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      httpMethod       = "$context.httpMethod"
      routeKey         = "$context.resourcePath"
      status           = "$context.status"
      protocol         = "$context.protocol"
      responseLength   = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
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

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'${var.cors_allowed_origin}'"
  }
}

resource "aws_api_gateway_gateway_response" "default_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "DEFAULT_5XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin" = "'${var.cors_allowed_origin}'"
  }
}

