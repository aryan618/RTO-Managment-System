const { Router } = require('express');
const path = require('path');
const router = Router();

router.get("/signup", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/signup.html'));
});

router.get("/login", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/login.html'));
});

router.get("/options", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/options.html'));
});

router.get("/dl_form", function(req, res) {
    res.sendFile(path.resolve('webpage/snippets/dl_form.html'));
});

module.exports = router;