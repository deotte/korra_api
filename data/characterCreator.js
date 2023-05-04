const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const firebaseDb = require('../firebase.js');

let inputStream = fs.createReadStream('./data/characters.csv', 'utf-8');

function createOrUpdateCharacter(row) {
	firebaseDb.collection('characters')
		.where("id", "==", row["ID"])
		.limit(1)
		.get()
		.then((querySnapshot) => {
			if (querySnapshot.empty) {
				createCharacter(row);
				return;
			}

			let queryDocSnapshot = querySnapshot.docs[0];
			updateCharacter(queryDocSnapshot, row);
		})
		.catch((error) => {
			console.log("Error getting character with ID " + row["ID"] + ": ", error);
		});
}

function createCharacter(row) {
	firebaseDb.collection('characters').add({
		id: row["ID"],
		name: row["Name"],
		type: row["Type"],
		birthdate: row["Birthdate"],
		first_episode: row["First Episode"],
		eye_color: row["Eye Color"],
		gender: row["Gender"],
		ethnicity: row["Ethnicity"].split('|'),
		nationality: row["Nationality"].split('|'),
		image_url: row["ImageUrl"]
	}).then((docRef) => {
		console.log("Character " + row["ID"] + " added in DB. Document ID: ", docRef.id);
	})
	.catch((error) => {
		console.error("Error adding character " + row["ID"] + ": ", error);
	});
}

function updateCharacter(queryDocSnapshot, row) {
	queryDocSnapshot.ref.update({
		name: row["Name"],
		type: row["Type"],
		birthdate: row["Birthdate"],
		first_episode: row["First Episode"],
		eye_color: row["Eye Color"],
		gender: row["Gender"],
		ethnicity: row["Ethnicity"].split('|'),
		nationality: row["Nationality"].split('|'),
		image_url: row["ImageUrl"]
	})
	.then(() => {
		console.log("Character " + row["ID"] + " successfully updated");
	})
	.catch((error) => {
		// The document probably doesn't exist.
		console.error("Error updating character " + row["ID"] + ": ", error);
	});
}

module.exports = {
	createOrUpdateCharactersFromFile: function() {
		inputStream
			.pipe(new CsvReadableStream({
				parseNumbers: true,
				parseBooleans: true,
				trim: true,
				asObject: true
			}))
			.on('data', function (row) {
				createOrUpdateCharacter(row);
			})
			.on('end', function () {
				console.log('All characters in file processed');
			});
	}
}
