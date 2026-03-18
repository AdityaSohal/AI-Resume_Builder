import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import resumeRouter from './routes/resumeRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to DB before handling requests
let isConnected = false
const ensureDBConnected = async () => {
    if (!isConnected) {
        await connectDB()
        isConnected = true
    }
}

app.use(async (req, res, next) => {
    try {
        await ensureDBConnected()
        next()
    } catch (error) {
        console.error('DB connection error:', error)
        res.status(500).json({ message: 'Database connection failed' })
    }
})

app.get('/', (req, res) => res.send('Server is live...'))
app.use('/api/users', userRouter)
app.use('/api/resume', resumeRouter)
app.use('/api/ai', aiRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found', path: req.path })
})

app.use((err, req, res, next) => {
    console.error('Server Error:', err)
    res.status(500).json({ message: 'Internal server error' })
})

// Local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

export default app