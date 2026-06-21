jungleShop
Enterprise Cloud E-Commerce Platform
Overview

jungleShop is a full-stack cloud-native e-commerce platform designed to simulate a modern online retail system similar to Amazon.

The application demonstrates enterprise software engineering principles by combining a responsive customer experience with secure administrative workflows, cloud infrastructure, payment processing, and scalable REST APIs.


The system was designed to:

Provide a seamless online shopping experience
Centralize product and inventory management
Securely process online payments
Store product assets in cloud storage
Improve order management and customer communication
Demonstrate production-ready cloud architecture
Showcase full-stack software engineering and DevOps practices
Business Impact

Traditional small businesses often struggle with fragmented inventory systems and manual order processing.


jungleShop addresses these challenges by:

Digitizing product management
Centralizing inventory and order data
Providing secure online payments
Reducing administrative overhead
Improving customer purchasing experience
Enabling scalable cloud deployment
Demonstrating enterprise-level software architecture
Key Features
Customer
Browse Products
Product Search
Category Filtering
Product Detail View
Shopping Cart
Secure Stripe Checkout
Order Confirmation
Product Management
Product Creation
Product Editing
Product Deletion
Product Image Upload
Category Management
Price Management
Administration
Secure Admin Login
Dashboard Overview
Product Management
Inventory Control
Order Monitoring
Payments
Stripe Checkout Integration
Secure Payment Processing
Order Recording
Payment Success / Failure Handling
Cloud Storage
Amazon S3 Product Image Upload
Secure Image Retrieval
Cloud Asset Management
Email Notifications
Order Confirmation Emails
Administrative Notifications
Amazon SES Integration
Security Features
Authentication

Protected Administrator Access

Admin Email:
bennydrizi@gmail.com

Password:
********

(Admin credentials stored securely using environment variables in production.)

Authorization

Role-based administrative access

Protected product management endpoints

Restricted image upload functionality

Data Protection
Environment Variable Configuration
Prepared SQL Statements
AWS Security Groups
Secure API Communication
Stripe Hosted Payment Pages
Cybersecurity Considerations
Principle of Least Privilege
Protected Administrative Routes
Secure Cloud Storage Access
Input Validation
SQL Injection Prevention
Credential Isolation


Technology Stack

Layer	Technology
Frontend	React
Styling	Tailwind CSS
Backend	Node.js
API Framework	Express.js
Database	Amazon RDS (MySQL)
Cloud Storage	Amazon S3
Email	Amazon SES
Payments	Stripe API
Hosting	Amazon EC2
Process Manager	PM2
Reverse Proxy	Nginx
Version Control	Git
Repository	GitHub


Architecture
Customer

↓

React Frontend

↓

REST API

↓

Node.js + Express

↓

Amazon RDS

↓

Amazon S3

↓

Stripe Checkout

↓

Amazon SES

↓

Order Confirmation


System Workflow

Browse Products

↓

Search / Filter

↓

View Product

↓

Add to Cart

↓

Stripe Checkout

↓

Payment Validation

↓

Order Stored in RDS

↓

Confirmation Email Sent

↓

Order Complete


Database Design
Products
Field	Type
id	INT
name	VARCHAR
description	TEXT
category	VARCHAR
price	INT
image	TEXT
Orders
Field	Type
id	INT
email	VARCHAR
total	INT
created_at	TIMESTAMP
REST API

Products

GET /api/products

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

Upload
POST /api/upload

Uploads product images to Amazon S3.
<img width="1340" height="677" alt="jungleshop" src="https://github.com/user-attachments/assets/7654a7f7-8112-42e3-b76f-1d726b0cbf3f" />
<img width="1340" height="677" alt="jungleshop" src="https://github.com/user-attachments/assets/c2c8c540-3fdd-4b12-a056-324f544e16eb" />

Checkout
POST /api/checkout

Creates Stripe Checkout Session and stores successful orders.

Screenshots
Home Page


Live Demo
http://jungleshop-frontend-mzi.s3-website.eu-north-1.amazonaws.com/


Hosted using

Amazon EC2
Amazon RDS
Amazon S3
Amazon SES
PM2
Nginx


Testing

Testing performed:

Functional Testing
REST API Testing
Database Validation
Payment Workflow Testing
Image Upload Testing
Authentication Testing
Responsive UI Testing
Integration Testing
User Acceptance Testing


Future Enhancements

JWT Authentication
Customer Accounts
Order History
Product Reviews
Wishlist
Inventory Analytics
Redis Caching
Docker Deployment
Kubernetes
GitHub Actions CI/CD
AI Product Recommendations
Multi-Vendor Marketplace


Author
Benedict de Almeida Mzizi

Software Engineer | Full Stack | Cloud | DevOps | Automation

GitHub
https://github.com/BenedictMzizi

LinkedIn
https://www.linkedin.com/in/benedict-mzizi<img width="1340" height="677" alt="jungleshop" src="https://github.com/user-attachments/assets/36d9ab7f-bc22-4847-9a6e-eeffa204bbae" />
