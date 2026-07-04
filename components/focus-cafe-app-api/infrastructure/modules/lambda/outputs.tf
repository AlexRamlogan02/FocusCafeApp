output "role_arn" {
  value = aws_iam_role.lambda.arn
}

output "policy_arn" {
  value = aws_iam_policy.lambda.arn
}
