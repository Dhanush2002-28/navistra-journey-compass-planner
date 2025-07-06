import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all itineraries (for admin or seeding purposes)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM itineraries ORDER BY destination ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get list of all destination names (for debugging)
router.get('/debug/destinations', async (req, res) => {
    try {
        const result = await pool.query('SELECT destination FROM itineraries ORDER BY destination ASC');
        const destinations = result.rows.map(row => row.destination);
        res.json({ destinations, count: destinations.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get personalized itinerary by destination, days, and budget
router.get('/:destination', async (req, res) => {
    try {
        const { destination } = req.params;
        const days = parseInt(req.query.days, 10);
        const budget = parseInt(req.query.budget, 10);
        console.log('🔍 API Request:', { destination, days, budget });
        const result = await pool.query('SELECT * FROM itineraries WHERE LOWER(destination) = LOWER($1)', [destination]);
        console.log('📊 Database query result rows:', result.rows.length);
        if (result.rows.length === 0) {
            console.log('❌ No itinerary found for destination:', destination);
            return res.status(404).json({ message: 'Itinerary not found.' });
        }
        console.log('✅ Found itinerary for:', destination);
        let itinerary = result.rows[0];
        // Parse JSON fields if needed
        if (typeof itinerary.details === 'string') itinerary.details = JSON.parse(itinerary.details);
        if (typeof itinerary.daywise === 'string') itinerary.daywise = JSON.parse(itinerary.daywise);
        // Personalize by days
        if (days && Array.isArray(itinerary.daywise)) {
            console.log('Slicing daywise from', itinerary.daywise.length, 'to', days, 'days');
            itinerary.daywise = itinerary.daywise.slice(0, days);
            itinerary.details.days = days;
            console.log('After slicing, daywise length:', itinerary.daywise.length);
        }
        // Optionally, filter by budget (for now, just include estimated_cost_inr)
        if (budget && itinerary.estimated_cost_inr > budget) {
            itinerary.over_budget = true;
        }
        res.json(itinerary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
