var express = require('express');
var routes = require('./src/routes/routes.js');

var app = express();

routes(app, process.env);

app.set('port', (process.env.PORT || 8080));

app.listen(process.env.PORT || 8080, function() {
	console.log("Server Listening on Port 8080");
});