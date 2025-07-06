import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get all trips for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new trip for the logged-in user
router.post('/', authenticateToken, async (req, res) => {
    const { destination, start_date, end_date, budget_inr, travel_style, travelers } = req.body;
    if (!destination || !start_date || !end_date || !budget_inr || !travelers) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO trips (user_id, destination, start_date, end_date, budget_inr, travel_style, travelers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [req.user.id, destination, start_date, end_date, budget_inr, travel_style, travelers]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/trips/:id - delete a trip by id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM trips WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Trip not found.' });
        }
        res.json({ message: 'Trip deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
