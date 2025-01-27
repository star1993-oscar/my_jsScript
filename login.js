const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const DBPool = require('./db');

// Initialize express app
require('dotenv').config();
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded; // Store the decoded payload in req.user
        next();
    });
};

// Middleware to check if user is a regular user
const verificationUser = (req, res, next) => {
    if (req.user.account === 'user' || req.user.account === 'admin') {
        console.log('You use USER account.');
        next();
    } else {
        res.status(403).json({ message: 'Access denied. User account required.' });
    }
};

// Middleware to check if user is an admin
const verificationAdmin = (req, res, next) => {
    if (req.user.account === 'admin') {
        console.log('You use ADMIN account.');
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin account required.' });
    }
};

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    let connection;
    try {
        connection = await DBPool.getConnection();

        const [results] = await connection.query(
            'SELECT * FROM `users` WHERE `username` = ? AND `password` = ?',
            [username, password]
        );

        if (results.length > 0) {
            const user = results[0];
            // Generate JWT with account type
            const token = jwt.sign({ id: user.username, account: user.account }, SECRET_KEY, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).json({ message: 'Login successful!', token: token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});
// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user.id });
});

app.get('/posts', async (req, res) => {
    
    let connection;
    try {
        connection = await DBPool.getConnection();
        const [results] = await connection.query('SELECT * FROM `posts_todo`');
        // console.log(results[0]);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// Route that requires user role  //verifyToken, verificationUser, 
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await DBPool.getConnection();
        const [results] = await connection.query('SELECT * FROM `posts_todo` WHERE `id` = ?', [id]);
        // console.log(results[0]);
        if (results.length > 0) {
            res.status(200).json(results[id-1]);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// Route that requires admin role
app.get('/privacy', verifyToken, verificationUser, verificationAdmin, (req, res) => {
    res.send('This is a privacy page for admins');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});