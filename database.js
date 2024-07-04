const sqlite3 = require('sqlite3').verbose();
const dbName = 'users.db';

let db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
        db.run('CREATE TABLE IF NOT EXISTS userList (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('User table created.');
            }
        });
        db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, receiver TEXT, message TEXT)', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Messages table created.');
            }
        });
    }
});

module.exports = db;
