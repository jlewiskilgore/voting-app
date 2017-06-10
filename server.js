var express = require('express');
var routes = require('./src/routes/routes.js');

var app = express();

var mongoose = require('mongoose');
var dbURL = process.env.MONGOLAB_URI;

mongoose.connect(dbURL || 'mongodb://localhost/votingdb');

var db = mongoose.connection;

db.on('error', function(err) {
	console.log(err);
})

db.once('open', function() {
	console.log('Connected to database.');

	app.use(function(req, res, next) {
		req.db = db;
		next();
	});

	app.use(express.static('public'));

	app.set('view engine', 'ejs');

	routes(app, process.env);

	app.set('port', (process.env.PORT || 8080));

	app.listen(process.env.PORT || 8080, function() {
		console.log('Server Listening on Port 8080');
	});
});
