import React, { useState, useEffect } from 'react';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedLogin = localStorage.getItem('login');
    if (savedLogin) {
      setLoggedInUser(savedLogin);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!login) {
      newErrors.login = 'Поле логін не може бути порожнім';
    } else if (!/\S+@\S+\.\S+/.test(login)) {
      newErrors.login = 'Некоректний формат email';
    }

    if (!password) {
      newErrors.password = 'Поле пароль не може бути порожнім';
    } else if (password.length < 10) {
      newErrors.password = 'Пароль має містити щонайменше 10 символів';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert('Помилка: ' + data.error);
      return;
    }

    localStorage.setItem('login', data.login);
    setLoggedInUser(data.login);
    setLogin('');
    setPassword('');
  } catch (err) {
    alert('Сервер недоступний: ' + err.message);
  }
};


  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <p>Ви увійшли як <strong>{loggedInUser}</strong></p>
          <button onClick={handleLogout}>Вийти</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Авторизація</h2>

        <label>Логін (Email):</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        {errors.login && <div className={styles.error}>{errors.login}</div>}

        <label>Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <div className={styles.error}>{errors.password}</div>}

        <button type="submit" disabled={!login || !password}>
          Увійти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;