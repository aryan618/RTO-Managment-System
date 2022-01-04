// const express = require('express');
// const path = require('path');
// const app = express();
// const server = require('http').createServer(app);

// app.get('/', function(req, res){
//     res.sendFile(__dirname + "/public/" + "index.html");
// });

// // app.post("/", function (req, res) {
// //     res.sendFile(__dirname + "/public/" + "index.html");
// //     res.send("Success!!!");
// //     // res.send("POST request called");
// // });

// app.use(express.static(path.join(__dirname, '/public/temp.js')));

// app.listen(3000, function (err) {
//     if(err) console.log(err);
//     console.log("Server is running on localhost:3000");
// });

const express = require('express');
const app = express();
const port = 3000;

const mysql = require('mysql');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Mysqlaccount1',
    database: 'rto1'
});

connection.connect();

connection.query("select 1+1 as solution", function (err, rows, fields) {
    if(err) throw err;

    console.log('The Solution is:', rows[0].solution);
});

connection.end();

app.listen(port, ()=>{
    console.log('Example app listening at http://localhost:${port}');
}); 