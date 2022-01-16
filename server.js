const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const customerRoute = require('./routes/customer');
const snippetsRoute = require('./routes/snippets');
const app = express();
const port = 3000;

app.use('/', express.static(__dirname + '/'));
app.use('/webpage', express.static(__dirname + '/webpage'));

app.use(express.json());

app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 2 * 60 * 1000 },
    saveUninitialized: false,
    resave: false
}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/webpage/index.html");
});

app.post("/", function(req, res) {
    res.sendFile(__dirname + "/webpage/index.html");
    res.send("Success!!!");
});

app.use('/customer', customerRoute);
app.use('/snippets', snippetsRoute);

app.listen(port, () => console.log("Server is running on http://localhost:" + port));