terraform {
  source = "../../terraform/modules//base"
}

inputs = {
  environment = "dev"
  project_name = "focus-cafe-app"
}
