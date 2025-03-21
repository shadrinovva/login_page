const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'my_users_db',
  password: '1508',
  port: 5432,
});

client.connect()
  .then(() => console.log('Подключение к базе данных успешно'))
  .catch(err => console.error('Ошибка подключения', err));

// Добавление тестового пользователя
const username = 'testuser';
const password = 'testpassword';
const email = 'test@example.com';

client.query(
  'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
  [username, password, email]
)
  .then(() => console.log('Пользователь добавлен'))
  .catch(err => console.error('Ошибка при добавлении пользователя', err))
  .finally(() => client.end());