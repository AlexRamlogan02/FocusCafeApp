variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "source_dir" {
  description = "Directory containing layer source"
  type        = string
}

variable "layer_name_suffix" {
  description = "Suffix for layer resource naming"
  type        = string
}
