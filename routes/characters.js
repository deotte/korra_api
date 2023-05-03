var express = require('express');
var router = express.Router();
var firebaseDb = require('../firebase.js');

router.get('/', function(req, res, next) {
	res.send('Hello');
});

router.get('/:id', function(req, res, next) {
	var randomId = 0;

	if (req.params.id === 'random') {
		randomId = Math.floor(Math.random() * 100) + 1;
		var docRef = firebaseDb.collection('characters').doc(randomId.toString());
	} else {
		var docRef = firebaseDb.collection('characters').doc(req.params.id);
	}


	docRef.get().then((doc) => {
		if (doc.exists) {
			res.send(doc.data());
			return;
		}

		res.send('Character not found with ID ' + req.params.id);
	});
});

module.exports = router;