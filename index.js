const express = require('express');
const { createItem, readItems, authenticateUser, sendMessage, getMessages } = require('./script');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/items', (req, res) => {
    readItems((err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(rows);
        }
    });
});

app.post('/items', (req, res) => {
    const { name, password } = req.body;
    createItem(name, password, (err, data) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send(`Item is added. ID: ${data.id}`);
        }
    });
});

app.post('/login', (req, res) => {
    const { name, password } = req.body;
    authenticateUser(name, password, (err, isAuthenticated) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (isAuthenticated) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

app.post('/send-message', (req, res) => {
    const { sender, receiver, message } = req.body;
    sendMessage(sender, receiver, message, (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send('Message sent');
        }
    });
});

app.get('/users', (req, res) => {
    readItems((err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            const users = rows.map(row => ({ name: row.name }));
            res.status(200).json(users);
        }
    });
});

app.get('/messages/:user/:receiver', (req, res) => {
    const { user, receiver } = req.params;
    getMessages(user, receiver, (err, messages) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(messages);
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
