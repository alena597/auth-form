const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/auth/login', (req, res) => {
  const { login, password } = req.body;

  db.get(`SELECT * FROM users WHERE login = ?`, [login], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Помилка сервера' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Користувача не знайдено' });
    }

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Помилка хешування' });
      }

      if (!result) {
        return res.status(401).json({ error: 'Невірний пароль' });
      }

      return res.json({ login: user.login });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
