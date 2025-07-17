const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'users.db'), (err) =>  {
    if (err) console.error('Помилка відкриття БД', err);
    else console.log('SQLite база підключена');
});

module.exports = db;