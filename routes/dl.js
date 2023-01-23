const { Router } = require('express');
const db = require("../database");
const router = Router();

router.post('/entry', (req, res) => {
    const {
        cust_id,
        dlno,
        name,
        dob,
        address,
        validity,
        blood
    } = req.body;
    try {
        db.promise().query(`insert into driving_license values ("${cust_id}", "${dlno}", "${name}", "${address}", "${dob}", "${validity}", "${blood}");`);
        console.log('1 row inserted!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    res.status(201).send('New user signed up!');
});

router.post('/retrieve', async(req, res) => {
    const {
        cust_id
    } = req.body;
    try {
        db.query(`select *
                from driving_license
                where cust_id = ${cust_id};`,
            function(err, result, fields) {
                if (err) throw err;
                res.send(result);
            });
        console.log('Data fetched!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    // res.status(201).send('Data fetched!');
});

router.post('/apchange', (req, res) => {
    const {
        cust_id,
        address,
        phone
    } = req.body;
    try {
        db.promise().query(`update driving_license set address = "${address}" where cust_id = ${cust_id};`);
        db.promise().query(`update customer set phone_no = "${phone}" where cust_id = ${cust_id};`);
        console.log('1 row affected!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    res.status(201).send('Data Updated!');
});

router.post('/addvehicle', (req, res) => {
    const {
        cust_id,
        vehiclenum,
        vname,
        vcolor,
        vclass,
        fueltype
    } = req.body;
    try {
        db.promise().query(`insert into vehicle values (${cust_id}, "${vehiclenum}", "${vname}", "${vcolor}", "${vclass}", "${fueltype}");`);
        console.log('1 row inserted!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    res.status(201).send('New Vehicle Registered!');
});

router.post('/voilationbw', async(req, res) => {
    const {
        cust_id,
        sdate,
        edate
    } = req.body;
    try {
        db.query(`
        select complaint_id, vehicle_no, place, date, fine, offence
        from vehicle
        join violations using(vehicle_no)
        where cust_id = ${cust_id} and
        date between '${sdate}' and '${edate}'`, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
        console.log('Data fetched!\n' + JSON.stringify(req.body));
    } catch (err) {
        console.log(err);
    }
    // res.status(201).send('Data fetched!');
});

module.exports = router;