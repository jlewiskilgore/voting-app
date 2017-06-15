var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var Poll = require('../../models/poll.js');
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../auth/passport.js');

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');

		polls.find().limit(25).toArray(function(error, result) {
			res.render('pages/index', { pollList: result });
		});
	});

	app.get('/login', function(req, res) {
		res.render('pages/login');
	});

	app.get('/auth/github',
		passport.authenticate('github'));

	app.get('/auth/github/login',
		passport.authenticate('github', { failureRedirect: '/login' }),
		function(req, res) {
			res.redirect('/');
		});

	app.get('/createPoll', function(req, res) {
		res.render('pages/addPoll');
	});

	app.post('/createPoll', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');

		var pollQuestion = req.body.question;
		var pollOwner = 'testAdmin'; // To be collected through user token info
		var choiceArr = [];
		var countArr = [];

		var numAnswers = req.body.numAnswers;
		var answerVal;

		for(var i = 1; i <= numAnswers; i++) {
			console.log(req.body['answer_' + i]);
			if(req.body['answer_' + i]) {
				choiceArr.push(req.body['answer_' + i]);
				countArr.push(0);
			}
		}

		var newPoll = new Poll({
			question: pollQuestion,
			owner: pollOwner,
			choices: choiceArr,
			choiceCounts: countArr
		});

		if(pollQuestion && pollQuestion.trim() != '') {
			newPoll.save(function(err, data) {
				if(err) {
					console.log(err);
				}
				else {
					console.log("New Poll Saved!");
					res.redirect('/');
				}
			});
		}

	});

	app.get('/viewPoll/:pollId', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');

		var pollId = req.params.pollId;

		polls.findOne({ "_id": ObjectId(pollId) }, function(err, result) {
			if(err) {
				console.log(err);
			}
			else if(result) {
				res.render('pages/viewPoll', 
					{ 
						pollId: pollId,
						pollQuestion: result.question,
						pollChoices: result.choices
					});
			}
			else {
				console.log("this poll does not exist...");
				res.redirect('/');
			}
		});
	});

	app.post('/viewPoll', function(req, res) {
		var choices = req.body.choices.split(',');

		res.render('pages/viewPoll', 
			{ 
				pollId: req.body.id,
				pollQuestion: req.body.question,
				pollChoices: choices
			});
	});

	app.post('/answerPoll', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');
		
		var pollId = req.body.pollId;
		var choiceCountArr;
		var selectedChoice = req.body.choiceIndex;

		polls.findOne({ "_id": ObjectId(pollId) }, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				choiceCountArr = result.choiceCounts;
				choiceCountArr[selectedChoice] += 1;
				polls.update(
					{ "_id": ObjectId(pollId) },
					{ $set: { "choiceCounts": choiceCountArr } },
					{ upsert: true}
				);
				res.redirect('/viewResults/' + pollId); // TODO: Change to view results page
			}
		});
	});

	app.get('/viewResults/:pollId', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');

		var pollId = req.params.pollId;

		polls.findOne({ "_id": ObjectId(pollId) }, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				res.render('pages/viewResults', 
					{ 
						question: result.question, 
						choices: result.choices, 
						choiceCounts: result.choiceCounts 
					});
			}
		});
	});

	app.post('/deletePoll/:pollId', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');

		var pollId = req.params.pollId;

		console.log(pollId);

		polls.remove({ "_id": ObjectId(pollId) }, function(err) {
			if(err) {
				console.log(err);
			}
			else {
				res.redirect('/');
			}
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};