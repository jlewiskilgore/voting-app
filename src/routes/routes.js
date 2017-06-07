var path = require('path');
var bodyParser = require('body-parser');
var Poll = require('../../models/poll.js');
var ObjectId = require('mongodb').ObjectId;

module.exports = function(app, env) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		var db = req.db;
		var polls = db.collection('polls');

		polls.find().limit(25).toArray(function(error, result) {
			res.render('pages/index', { pollList: result });
		});
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

		if(req.body.answer_1) {
			choiceArr.push(req.body.answer_1);
			countArr.push(0);
		}
		if(req.body.answer_2) {
			choiceArr.push(req.body.answer_2);
			countArr.push(0);
		}
		if(req.body.answer_3) {
			choiceArr.push(req.body.answer_3);
			countArr.push(0);
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
				res.render('pages/viewResults', { question: result.question, choices: result.choices, choiceCounts: result.choiceCounts });
			}
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};