'use strict';

var CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const UserTestConstants = require('../user_test_constants');

class GetTeamMember extends CodeStreamAPITest {

	get description () {
		return 'should return user when requesting someone else who is on one of my teams (from a repo created by a third user)';
	}

	getExpectedFields () {
		return UserTestConstants.EXPECTED_USER_RESPONSE;
	}

	before (callback) {
		BoundAsync.series(this, [
			this.createOtherUser,
			this.createRandomRepo
		], callback);
	}

	createOtherUser (callback) {
		this.userFactory.createRandomUser(
			(error, response) => {
				if (error) { return callback(error); }
				this.otherUserData = response;
				callback();
			}
		);
	}

	createRandomRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.otherUser = response.users[0];
				this.path = '/users/' + this.otherUser._id;
				callback();
			},
			{
				withRandomEmails: 2,
				withEmails: [this.currentUser.email],
				token: this.otherUserData.accessToken
			}
		);
	}

	validateResponse (data) {
		this.validateMatchingObject(this.otherUser._id, data.user, 'user');
		this.validateSanitized(data.user, UserTestConstants.UNSANITIZED_ATTRIBUTES);
	}
}

module.exports = GetTeamMember;