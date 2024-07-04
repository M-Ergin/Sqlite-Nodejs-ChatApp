const db = require('./database');

const createItem = (name, password, callback) => {
    const sql = 'INSERT INTO userList (name, password) VALUES (?, ?)';
    db.run(sql, [name, password], function(err) {
        callback(err, { id: this.lastID });
    });
};

const readItems = (callback) => {
    const sql = 'SELECT * FROM userList';
    db.all(sql, [], callback);
};

const authenticateUser = (name, password, callback) => {
    const sql = 'SELECT * FROM userList WHERE name = ? AND password = ?';
    db.get(sql, [name, password], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row ? true : false);
    });
};

const sendMessage = (sender, receiver, message, callback) => {
    const sql = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
    db.run(sql, [sender, receiver, message], function(err) {
        callback(err, { id: this.lastID });
    });
};

const getMessages = (user, receiver, callback) => {
    const sql = 'SELECT * FROM messages WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)';
    db.all(sql, [user, receiver, receiver, user], callback);
};

module.exports = { createItem, readItems, authenticateUser, sendMessage, getMessages };
