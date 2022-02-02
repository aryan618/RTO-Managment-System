const { Router } = require('express');
const db = require("../database");
const router = Router();

router.post('/entry', (req, res) => {
    const { cust_id, dlno, name, dob, address, validity, blood } = req.body;
    try {
        db.promise().query(`insert into driving_lisence values ("${cust_id}", "${dlno}", "${name}", "${address}", "${dob}", "${validity}", "${blood}");`);
        console.log('1 row inserted!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    res.status(201).send('New user signed up!');
});

module.exports = router;