'use strict';

const NoPartialUpdateTest = require('./no_partial_update_test');
const Assert = require('assert');
const BoundAsync = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/bound_async');

class FetchNoPartialUpdateTest extends NoPartialUpdateTest {

	get description () {
		return 'when updating a tag, if ${this.parameter} is not provided, it is deleted (a partial update is not supported), checked by fetching the team';
	}

	// run the actual test...
	run (callback) {
		// we'll run the update, but also verify the update took by fetching and validating
		// the team object
		BoundAsync.series(this, [
			super.run,
			this.validateTeamObject
		], callback);
	}

	// fetch and validate the team object against the update we made
	validateTeamObject (callback) {
		this.doApiRequest({
			method: 'get',
			path: '/teams/' + this.team.id,
			token: this.token
		}, (error, response) => {
			if (error) { return callback(error); }
			Assert.deepEqual(response.team.tags, this.expectedTags);
			callback();
		});
	}
}

module.exports = FetchNoPartialUpdateTest;
