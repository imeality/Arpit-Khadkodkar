var mysql = require('mysql');

module.exports = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'venueFinder',
  password: '12345'  
})

