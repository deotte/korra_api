const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const firebaseDb = require('../firebase.js');

let inputStream = fs.createReadStream('./data/characters.csv', 'utf-8');

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

function createOrUpdateCharacter(row) {
	firebaseDb.collection('characters').doc(row["ID"].toString()).set({
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
		console.log('Character ' + row["ID"] + 'successfully created or updated in DB');
	})
	.catch((error) => {
		console.log('Character ' + row["ID"] + 'not created or updated: ', error);
	});
}