const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '26e$pinozaolivare$92000',
  database: 'luiki_kart',
});

module.exports = pool;