const { Router } = require('express');
const db = require("../database");
const router = Router();

var format = /[ '"?*^&!]/;

router.post("/insert", async function(req, res) {
    const { name, address } = req.body;
    // const result = (await db.promise().query(`select cust_id from customer`))[0];
    // const lastCustId = result[result.length - 1].cust_id;

    try {
        db.promise().query(`insert into customer (name, address) values ("${name}","${address}");`);
        console.log('1 row inserted!');
        console.log(name + ' ' + address);
    } catch (err) {
        console.log(err);
    }
    res.sendStatus(201);
});

router.post('/verify', async function(req, res) {
    const { customer, password, rememberMe } = req.body;
    if (format.test(customer)) {
        res.send('Please enter valid customer ID');
        return;
    }
    console.log(req.sessionID);
    if (req.session.authentication) {
        res.status(200).send('Already authenticated customer ID ' + req.session.user);
        return;
    }
    try {
        const { cust_id } = await db.promise().query(`select cust_id from customer where cust_id = ${customer};`)
            .then(res => res[0][0]);
        if (cust_id) {
            const pass = (await db.promise().query(`select password from customer where cust_id = ${cust_id};`))[0][0].password;
            if (password == pass) {
                req.session.authentication = true;
                req.session.user = customer;
                req.session.cookie.expires = false;
                res.send('Authentication successful');
            } else
                res.status(403).send('Wrong password entered');
        } else
            res.status(403).send('Customer not found');
    } catch (err) {
        res.status(403).send('Something went wrong!');
        console.log(err);
    }
});

router.get('/logout', function(req, res) {
    console.log('logging out');
    req.session.destroy();
    res.status(200).send('Logout successful');
});

module.exports = router;