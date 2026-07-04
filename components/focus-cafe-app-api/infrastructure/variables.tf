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

variable "cors_allowed_origin" {
  description = "Allowed CORS origin"
  type        = string
  default     = "*"
}

variable "dynamodb_table_name" {
  description = "Optional override for DynamoDB table name"
  type        = string
  default     = ""
}
