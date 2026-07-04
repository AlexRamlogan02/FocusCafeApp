terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_lambda_layer_version" "deps" {
  filename            = "${path.module}/layer.zip"
  layer_name          = "${var.project_name}-${var.environment}-deps"
  compatible_runtimes = ["nodejs20.x"]
}
