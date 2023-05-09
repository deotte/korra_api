var express = require('express');
var router = express.Router();
const firebaseDb = require('../firebase.js');
const characterCount = 21; // Count length of CSV file

router.get('/', function(req, res, next) {
	let startAt = 1;

	const perPageQuery = req.query.perPage || 50;
	const pageNumber = req.query.page || 1;
	const nationalityQuery = req.query.nationality?.split(',');
	const ethnicityQuery = req.query.ethnicity?.split(',');

	if (pageNumber > 1) {
		startAt = ((pageNumber - 1) * perPageQuery) + 1;
	}

	let query = firebaseDb.collection('characters');

	if (nationalityQuery !== undefined && ethnicityQuery === undefined) {
		query = query.where("nationality", "array-contains-any", nationalityQuery);
	}

	if (ethnicityQuery !== undefined && nationalityQuery === undefined) {
		query = query.where('ethnicity', 'array-contains-any', ethnicityQuery);
	}
 
	query
		.orderBy("id")
		.limit(perPageQuery)
		.startAt(startAt)
		.get()
		.then((querySnapshot) => {
			if (querySnapshot.empty) {
				let errorMessage = 'No characters found - your requested pageNumber + pageNumber could be too high, or nationality/ethnicity filter could be incorrect.'
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