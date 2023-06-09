var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');

var indexRouter = require('./routes/index.js');
var charactersRouter = require('./routes/characters.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/characters', charactersRouter);

dotenv.config();

if (process.env.ENVIRONMENT === 'production') {
	var characterCreator = require('./data/characterCreator.js');
	characterCreator.createOrUpdateCharactersFromFile();
}

module.exports = app;
