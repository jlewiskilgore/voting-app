var path = require('path');

module.exports = function(app, env) {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname + '/../../public/index.html'));
	});

	app.get('/createPoll', function(req, res) {
		res.sendFile(path.join(__dirname + '/../../public/addPoll.html'));
	});

	app.post('/createPoll', function(req, res) {
		console.log("createPoll post...");
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};