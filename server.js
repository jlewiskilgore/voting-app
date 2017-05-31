var express = require('express');
var routes = require('./src/routes/routes.js');

var app = express();

//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var dbURL = process.env.MONGOLAB_URL;

mongoose.connect((dbURL || 'mongodb://localhost:27017/votingdb'), function(err, db) {
	if(!err) {
		console.log("Connected to database.");
	}
	else if(err) {
		console.log(err);
	}

	app.use(function(req, res, next) {
		req.db = db;
		next();
	});

	app.use(express.static('public'));

	routes(app, process.env);

	app.set('port', (process.env.PORT || 8080));

	app.listen(process.env.PORT || 8080, function() {
		console.log("Server Listening on Port 8080");
	});
});
