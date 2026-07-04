output "api_gateway_id" {
  value = aws_api_gateway_rest_api.main.id
}

output "api_gateway_execution_arn" {
  value = aws_api_gateway_rest_api.main.execution_arn
}

output "lambda_function_name" {
  value = aws_lambda_function.api.function_name
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.main.id
}
