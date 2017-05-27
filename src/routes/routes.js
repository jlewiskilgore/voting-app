var path = require('path');

module.exports = function(app, env) {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname + '/../../public/index.html'));
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};