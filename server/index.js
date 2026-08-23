import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import contactRoutes from './routes/contactRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parth-portfolio'

app.use(cors({
  origin: ['http://localhost:5173', 'https://portfolio-phi-mocha-13.vercel.app'],
  credentials: true
}));
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }))
app.use('/api/contact', contactRoutes)

app.use(notFound)
app.use(errorHandler)


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    // Start the server anyway so the frontend can still be developed against it
    app.listen(PORT, () => console.log(`Server running (no DB) on http://localhost:${PORT}`))
  })
