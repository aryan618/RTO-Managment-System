const mysql = require('mysql2');
const dotenv = require('dotenv').config();

module.exports = mysql.createConnection({
<<<<<<< HEAD
    host: 'localhost',
    user: 'root',
    password: process.env.DBPASS,
    database: 'rto1'
=======
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
>>>>>>> 844191834665982bce805178cfe1c8668b09c038
});