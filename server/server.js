import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

await connectDB();

app.get('/', (req, res) => res.send("Server is live..."));
app.use('/api/users', userRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/ai', aiRoutes);

// FIX: Public resume endpoint used by Preview.jsx (/view/:resumeID)
// This proxies to the protected router's public sub-route
// The resumeRouter already handles GET /public/:resumeID without auth
// Preview.jsx was calling GET /resume/:resumeID (no auth) — now uses /api/resume/public/:resumeID

app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  - POST /api/users/register');
    console.log('  - POST /api/users/login');
    console.log('  - GET  /api/users/data');
    console.log('  - GET  /api/users/resume');
    console.log('  - GET  /api/resume/public/:resumeID  (no auth)');
    console.log('  - GET  /api/resume/:resumeID         (auth required)');
});