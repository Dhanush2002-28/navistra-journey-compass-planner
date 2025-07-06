import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import tripsRoutes from './routes/trips.js';
import itinerariesRoutes from './routes/itineraries.js';
import chatRoutes from './routes/chat.js';
import pdfRoutes from './routes/pdf.js';

// Load environment variables from .env file
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔧 DEBUG: Environment Variables Status at Startup:');
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   - PORT: ${process.env.PORT || 'not set (using default 5000)'}`);
console.log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? 'Present' : 'Missing'}`);
console.log(`   - GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Present (' + process.env.GEMINI_API_KEY.substring(0, 10) + '...)' : 'Missing'}`);
console.log(`   - GROQ_API_KEY: ${process.env.GROQ_API_KEY ? 'Present (' + process.env.GROQ_API_KEY.substring(0, 10) + '...)' : 'Missing'}`);
console.log(`   - HUGGING_FACE_API_KEY: ${process.env.HUGGING_FACE_API_KEY ? 'Present (' + process.env.HUGGING_FACE_API_KEY.substring(0, 10) + '...)' : 'Missing'}`);
console.log('----------------------------------------');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Navistra Backend API is running');
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
