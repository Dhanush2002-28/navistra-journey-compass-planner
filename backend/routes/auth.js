import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists.' });
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, password_hash]
        );
        const token = jwt.sign({ id: newUser.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user: newUser.rows[0], token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPass) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email }, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
