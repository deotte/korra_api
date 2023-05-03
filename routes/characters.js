var express = require('express');
var router = express.Router();
var firebaseDb = require('../firebase.js');

router.get('/', function(req, res, next) {
	res.send('Hello');
});

router.get('/:id', function(req, res, next) {
	var docRef = firebaseDb.collection('characters').doc(req.params.id);

	docRef.get().then((doc) => {
		if (doc.exists) {
			res.send(doc.data());
			return;
		}

		res.send('Hello');
	});
});

module.exports = router;