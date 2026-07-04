terraform {
  source = "../../..//infrastructure"
}

inputs = {
  environment    = "dev"
  project_name   = "pomobrew"
  aws_region     = "us-east-1"
  aws_account_id = get_env("AWS_ACCOUNT_ID")
}
