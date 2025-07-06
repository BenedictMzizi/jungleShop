variable "region" {
  default = "eu-north-1"
}

variable "key_name" {
  description = "SSH key name"
  type        = string
}

variable "db_password" {
  description = "RDS root password"
  type        = string
  sensitive   = true
}