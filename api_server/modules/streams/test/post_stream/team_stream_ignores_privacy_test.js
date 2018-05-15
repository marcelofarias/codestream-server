'use strict';

var PostTeamStreamTest = require('./post_team_stream_test');
var Assert = require('assert');

class TeamStreamIgnoresPrivacyTest extends PostTeamStreamTest {

	get description () {
		return 'should return a valid stream and ignore the privacy attribute when creating a team stream';
	}

	// before the test runs...
	before (callback) {
		// run standard setup for creating a team stream...
		super.before(error => {
			if (error) { return callback(error); }
			// ...and add a "private" privacy setting, which should be ignored
			this.data.privacy = 'private';
			callback();
		});
	}

	// validate the response to the test request
	validateResponse (data) {
		// we should still see that privacy is public
		let stream = data.stream;
		Assert(stream.privacy === 'public', 'privacy should be public');
		super.validateResponse(data);
	}
}

module.exports = TeamStreamIgnoresPrivacyTest;