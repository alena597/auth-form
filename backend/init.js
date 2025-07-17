const db = require('./db');
const bcrypt = require('bcrypt');

const login = 'user@example.com';
const plainPassword = '1234567890'; 
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) return console.error(err);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT UNIQUE,
      password_hash TEXT
    )
  `, () => {
    db.run(
      `INSERT OR IGNORE INTO users (login, password_hash) VALUES (?, ?)`,
      [login, hash],
      (err) => {
        if (err) console.error(err);
        else console.log('Користувача додано');
        db.close();
      }
    );
  });
});
