const { Router } = require('express');
const path = require('path');
const router = Router();

router.get("/form1", function (req, res) {
    res.sendFile(path.resolve('webpage/snippets/form1.html'));
});

module.exports = router;