var express = require('express');
var router = express.Router();
const firebaseDb = require('../firebase.js');
const characterCount = 21; // Count length of CSV file

router.get('/', function(req, res, next) {
	const perPageQuery = req.query.perPage || 50;
	const pageNumber = req.query.page || 1;
	let startAt = 1;

	if (pageNumber > 1) {
		startAt = ((pageNumber - 1) * perPageQuery) + 1;
	}

	firebaseDb.collection('characters')
		.orderBy("id")
		.limit(perPageQuery)
		.startAt(startAt)
		.get()
		.then((querySnapshot) => {
			if (querySnapshot.empty) {
				let errorMessage = 'No characters found - your requested page number + per page might be over the amount of characters in the database.'
				console.log(errorMessage);
				res.send(errorMessage);
				return;
			}

			let characters = [];
			querySnapshot.forEach((doc) => {
				characters.push(doc.data());
			});

			res.send(characters);
		})
		.catch((error) => {
			let errorMessage = 'Characters not retrieved in database: ' + JSON.stringify(error);
			console.log(errorMessage);
			res.status(500).send(errorMessage);
		})
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
			res.status(500).send(errorMessage);
    	});
});

module.exports = router;