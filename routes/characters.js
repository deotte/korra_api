var express = require('express');
var router = express.Router();
const firebaseDb = require('../firebase.js');
const characterCount = 21; // Count length of CSV file

router.get('/', function(req, res, next) {
	res.send('Hello');
});

router.get('/:id', function(req, res, next) {
	var characterId = 0;

	if (req.params.id === 'random') {
		characterId = Math.floor(Math.random() * characterCount) + 1;
	} else {
		characterId = Number(req.params.id);
	}

	firebaseDb.collection('characters')
		.where("id", "==", characterId)
		.limit(1)
		.get()
		.then((querySnapshot) => {
			if (querySnapshot.empty) {
				res.send('Character not found with ID ' + characterId);
				return;
			}

			let queryDocSnapshot = querySnapshot.docs[0];
			let characterObj = queryDocSnapshot.data();
			res.send(characterObj);
		})
		.catch((error) => {
			let errorMessage = "Error getting character with ID " + characterId + ": " + JSON.stringify(error);
			console.log(errorMessage);
			res.send(errorMessage);
    	});
});

module.exports = router;