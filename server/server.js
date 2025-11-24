import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import productRoutes from './routes/product.route.js'
import orderRoutes from './routes/order.route.js'
import authRoutes from './routes/auth.route.js'
import reviewRoutes from './routes/review.route.js'

// 1. .env-ni eng birinchi yuklaymiz (Updated)
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

const PORT = process.env.PORT || 3003

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/reviews', reviewRoutes)

app.listen(PORT, () => {
	connectDB()
	console.log('Server is running on http://localhost:' + PORT)
})
