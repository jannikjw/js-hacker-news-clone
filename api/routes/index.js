var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.json({ status: 1, message: 'Centerling News API says "Hello World!"' });
});

module.exports = router;

