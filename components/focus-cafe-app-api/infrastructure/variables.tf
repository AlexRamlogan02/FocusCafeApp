variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "cors_allowed_origins" {
  description = "Allowed CORS origins for API responses"
  type        = list(string)
  default     = ["*"]
}

variable "dynamodb_table_name" {
  description = "Optional DynamoDB table name override"
  type        = string
  default     = ""
}
