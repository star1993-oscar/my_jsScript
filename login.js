const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize express app
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Predefined users list
const users = [
    { username: 'star', password: 'qwe', account: 'admin' },
    { username: 'olaf', password: 'asd', account: 'user' },
    { username: 'moon', password: 'zxc', account: 'user' }
];

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
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Generate JWT with account type
        const token = jwt.sign({ id: user.username, account: user.account }, SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).json({ message: 'Login successful!', token: token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user.id });
});

// Route that requires user role
app.get('/test/:id', verifyToken, verificationUser, (req, res, next) => {
    const { id } = req.params;
    if (id == '1') {
        res.send('This is first page!');
        return;
    }
    next();
}, (req, res) => {
    console.log('[asdfasdf3]');
    res.send('everything is ok');
});

// Route that requires admin role
app.get('/privacy', verifyToken, verificationUser, verificationAdmin, (req, res, next) => {
    const { id } = req.params;
    if (id == '1') {
        res.send('this is test');
        return;
    }
    console.log('[asdfasdf2]');
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});