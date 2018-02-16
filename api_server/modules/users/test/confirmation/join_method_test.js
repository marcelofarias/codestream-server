'use strict';

var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
var ConfirmationTest = require('./confirmation_test');
var Assert = require('assert');
var RandomString = require('randomstring');
const SecretsConfig = require(process.env.CS_API_TOP + '/config/secrets.js');

class JoinMethodTest extends ConfirmationTest {

	get description () {
		return 'the user\'s joinMethod attribute should get updated to Added to Team when a user confirms registration and they are already on a team';
	}

	// before the test runs...
	before (callback) {
		BoundAsync.series(this, [
			this.createOtherUser,	// create a second registered user
			this.createRepo,		// have that user create a repo, which creates a team, which the user for the test will already be on
			this.registerUser		// register the user, which basically gives us the confirmation code we will now use to confirm
		], callback);
	}

	// create a second registered user
	createOtherUser (callback) {
		this.userFactory.createRandomUser(
			(error, response) => {
				if (error) { return callback(error);}
				this.otherUserData = response;
				callback();
			}
		);
	}

	// create a repo to use for the test
	createRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				const unregisteredUser = response.users.find(user => !user.isRegistered);
				this.data = {
					userId: unregisteredUser._id,
					email: unregisteredUser.email
				};
				callback();
			},
			{
				withRandomEmails: 1,					// include another unregistered user, this is the user we'll register and confirm
				token: this.otherUserData.accessToken	// "other" user creates the repo and team
			}
		);
	}

	// register the user that was already created (without confirmation)
	registerUser (callback) {
		// form the data for the registration
		let register = {
			email: this.data.email,
			username: RandomString.generate(12),
			password: RandomString.generate(12),
			firstName: RandomString.generate(8),
			lastName: RandomString.generate(9),
			_confirmationCheat: SecretsConfig.confirmationCheat,	// gives us the confirmation code in the response
			_forceConfirmation: true								// this forces confirmation even if not enforced in environment
		};
		// register this user (without confirmation)
		this.userFactory.registerUser(
			register,
			(error, response) => {
				if (error) { return callback(error); }
				this.data.confirmationCode = response.user.confirmationCode;
				this.beforeConfirmTime = Date.now();	// to confirm registeredAt set during the request
				callback();
			}
		);
	}

	// validate the response to the test request
	validateResponse (data) {
		// validate that the joinMethod has been set to "Added to Team"
		Assert(data.user.joinMethod === 'Added to Team', 'joinMethod not properly set');
		super.validateResponse(data);
	}
}

module.exports = JoinMethodTest;