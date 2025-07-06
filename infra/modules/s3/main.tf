resource "aws_s3_bucket" "product_images" {
  bucket = "mini-amazon-images-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}
