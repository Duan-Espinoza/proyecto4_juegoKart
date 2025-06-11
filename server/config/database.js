const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Geovanny-11',
  database: 'luiki_kart',
});

module.exports = pool;