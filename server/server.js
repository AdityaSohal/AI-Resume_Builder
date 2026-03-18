import dotenv from 'dotenv'
dotenv.config()  // MUST be first — before any import that reads process.env

import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import resumeRouter from './routes/resumeRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

await connectDB()

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log('Available routes:')
    console.log('  - POST /api/users/register')
    console.log('  - POST /api/users/login')
    console.log('  - GET  /api/users/data')
    console.log('  - GET  /api/users/resume')
    console.log('  - GET  /api/resume/public/:resumeID  (no auth)')
    console.log('  - GET  /api/resume/:resumeID         (auth required)')
})