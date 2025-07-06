resource "aws_s3_bucket" "product_images" {
  bucket = "jungleshop-product-images"
  acl    = "public-read"

  tags = {
    Name = "jungleshop-product-images"
  }
}
