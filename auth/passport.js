var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config.js');
var User = require('../models/user');
var init = require('./init');

passport.use(new GitHubStrategy({
	clientID: config.githubConfig.GITHUB_CLIENT_ID,
	clientSecret: config.githubConfig.GITHUB_CLIENT_SECRET,
	callbackURL: config.githubConfig.GITHUB_CLIENT_URL
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		
		var searchQuery = {
			username: profile.login
		};

		var updates = {
			username: profile.login,
			userId: profile.id
		};

		var options = {
			upsert: true
		};

		User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
			if(err) {
				return done(err);
			}
			else {
				return done(null, user);
			}
		});
	}
));

init();

module.exports = passport;

//profile.login
//profile.id