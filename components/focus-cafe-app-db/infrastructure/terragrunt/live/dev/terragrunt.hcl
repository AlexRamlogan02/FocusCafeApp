terraform {
  source = "../../..//infrastructure"
}

inputs = {
  environment = "dev"
  project_name = "pomobrew"
  aws_region = "us-east-1"
}
