variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "AlexRamlogan02"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "FocusCafeApp"
}

variable "deploy_role_name" {
  description = "Name of the GitHub Actions deploy role"
  type        = string
  default     = "focuscafe-github-oidc-deploy-role"
}
