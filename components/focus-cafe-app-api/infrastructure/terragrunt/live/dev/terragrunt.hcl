terraform {
  source = "../../..//infrastructure"
}

inputs = {
  environment = "dev"
  project_name = "focus-cafe-app"
  aws_region = "us-east-1"
}
