const { Router } = require('express');
const db = require("../database");
const router = Router();

router.post("/insert", async function (req, res) {
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

module.exports = router;