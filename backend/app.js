import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import AWS from 'aws-sdk'
import Stripe from 'stripe'

import productRoutes from './routes/products.js'
import uploadRoutes from './routes/upload.js'
import checkoutRoutes from './routes/checkout.js'
import authRoutes from './routes/auth.js'
import cartRoutes from './routes/cart.js'
import ordersRoutes from './routes/orders.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
})

export const s3 = new AWS.S3()
export const stripeInstance = stripe

export const adminAuth = (req, res, next) => {
  const { email, password } = req.headers
  if (email === 'bennydrizi@gmail.com' && password === 'Admin123') next()
  else res.status(401).json({ error: 'Unauthorized' })
}

app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', ordersRoutes)

export default app

