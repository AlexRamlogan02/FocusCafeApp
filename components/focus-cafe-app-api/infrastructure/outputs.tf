output "api_gateway_id" {
  value = aws_api_gateway_rest_api.main.id
}

output "api_gateway_execution_arn" {
  value = aws_api_gateway_rest_api.main.execution_arn
}

output "lambda_function_names" {
  value = { for key, fn in aws_lambda_function.endpoint_lambda : key => fn.function_name }
}

output "api_gateway_invoke_url" {
  value = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.main.stage_name}"
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.main.id
}
