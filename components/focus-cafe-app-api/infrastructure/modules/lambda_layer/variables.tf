variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "source_dir" {
  description = "Directory containing Lambda layer source"
  type        = string
}
