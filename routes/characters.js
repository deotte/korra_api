var express = require('express');
var router = express.Router();
var firebaseDb = require('../firebase.js');

router.get('/', function(req, res, next) {
	res.send('Hello');
});

router.get('/:id', async function(req, res, next) {
	console.log(req.params.id);
	res.send('Hello');
});

module.exports = router;