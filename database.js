const mysql = require('mysql2');
const dotenv = require('dotenv').config();

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DBPASS,
    database: 'rto1'
});