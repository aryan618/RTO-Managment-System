const { Router } = require('express');
const db = require("../database");
const router = Router();

var format = /[ '"?*^&!]/;

router.post("/signup", async function(req, res) {
    const { name, email, password, phone } = req.body;
    try {
        db.promise().query(`insert into customer (name, email, password, phone_no) values ("${name}", "${email}", "${password}", "${phone}");`);
        console.log('1 row inserted!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    res.status(201).send('New user signed up!');
});

router.post('/verify', async function(req, res) {
    const { email, password, rememberMe } = req.body;
    if (format.test(email)) {
        res.send('Please enter valid customer ID');
        return;
    }
    console.log(req.sessionID);
    if (req.session.authentication) {
        res.status(200).send('Already authenticated customer ID ' + req.session.user);
        return;
    }
    try {
        console.log(email);
        const { cust_id } = await db.promise().query(`select cust_id from customer where email = "${email}";`)
            .then(res => res[0][0]);
        if (cust_id) {
            const pass = (await db.promise().query(`select password from customer where cust_id = ${cust_id};`))[0][0].password;
            if (password == pass) {
                req.session.authentication = true;
                req.session.user = cust_id;
                req.session.cookie.expires = false;
                res.send('Authentication successful');
            } else
                res.status(403).send('Wrong password entered');
        } else
            res.status(403).send('Customer not found');
    } catch (err) {
        res.status(403).send('Customer not found');
        console.log(err);
    }
});

router.post('/authenticated', (req, res) => {
    var data = {
        user: req.session.user
    };

    if (req.session.authentication)
        data.auth = true;
    else
        data.auth = false
    res.send(data);
});

router.post('/logout', function(req, res) {
    console.log('logging out');
    req.session.destroy();
    res.status(200).send('Logout successful');
});

module.exports = router;