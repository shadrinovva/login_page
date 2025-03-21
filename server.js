const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Отдача статических файлов (должна быть выше маршрутов)
app.use(express.static(path.join(__dirname, 'public')));
// Маршрут для страницы успешной регистрации
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
  });

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'my_users_db',
  password: '1508',
  port: 5432,
});

client.connect()
  .then(() => console.log('Подключение к базе данных успешно'))
  .catch(err => console.error('Ошибка подключения к базе данных', err));

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Маршрут для страницы регистрации
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
  });

// Маршрут для регистрации
app.post('/register', async (req, res) => {
  console.log('Получены данные:', req.body);
  const { username, email, password } = req.body;

  try {
    const query = `
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [username, password, email];

    const result = await client.query(query, values);
    console.log('Пользователь добавлен:', result.rows[0]);

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId: result.rows[0].id });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});