const express = require('express');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Predefined users list
const users = [
    { username: 'star', password: 'qwe' },
    { username: 'olaf', password: 'asd' },
    { username: 'moon', password: 'zxc' }
];

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});