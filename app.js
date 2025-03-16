const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

let users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/search', (req, res) => {
    const query = req.query.q || '';
    const results = [];
    res.json(results);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.json({ status: 'User registered' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        res.json({ status: 'Login successful', username });
    } else {
        res.json({ status: 'Login failed' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});