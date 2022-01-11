const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'kevin',
    password: 'keshav929',
    database: 'rto1'
});