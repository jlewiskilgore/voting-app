var mongoose = require('mongoose'); 

var pollSchema = new mongoose.Schema({
	question: String,
	owner: String,
	choices: [String],
	choiceCounts: [Number]
});

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;