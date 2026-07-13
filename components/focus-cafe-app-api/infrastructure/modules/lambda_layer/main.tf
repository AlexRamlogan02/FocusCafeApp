terraform {
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

data "archive_file" "layer" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = "${path.module}/.build/${var.project_name}-${var.environment}-${var.layer_name_suffix}.zip"
}

resource "aws_lambda_layer_version" "deps" {
  filename            = data.archive_file.layer.output_path
  source_code_hash    = data.archive_file.layer.output_base64sha256
  layer_name          = "${var.project_name}-${var.environment}-${var.layer_name_suffix}"
  compatible_runtimes = ["nodejs22.x"]
}
