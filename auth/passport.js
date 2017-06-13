var GitHubStrategy = require('passport-github').Strategy;
var config = require('../config.js');

module.exports = function(passport) {
	passport.use(new GitHubStrategy({
		clientID: config.githubConfig.GITHUB_CLIENT_ID,
		clientSecret: config.githubConfig.GITHUB_CLIENT_SECRET,
		callbackURL: config.githubConfig.GITHUB_CLIENT_URL
		},
		function(accessToken, refreshToken, profile, cb) {
			/*User.findOrCreate({ githubId: profile.id }, function(err, user) {
				return cb(err, user);
			}); */
			console.log(profile);
		}
	));
};