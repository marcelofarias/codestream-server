'use strict';

var CodeStreamMessageTest = require(process.env.CS_API_TOP + '/services/api/modules/messager/test/codestream_message_test');
var BoundAsync = require(process.env.CS_API_TOP + '/lib/util/bound_async');
var RandomString = require('randomstring');
const SecretsConfig = require(process.env.CS_API_TOP + '/config/secrets.js');

class ConfirmationMessageToOtherUserTest extends CodeStreamMessageTest {

	get description () {
		return 'team members should receive a message indicating a user is registered when a user on the team confirms registration';
	}

	makeData (callback) {
		BoundAsync.series(this, [
			this.createOtherUser,
			this.createRepo
		], callback);
	}

	createOtherUser (callback) {
		this.userFactory.createRandomUser(
			(error, response) => {
				if (error) { return callback(error);}
				this.otherUserData = response;
				callback();
			}
		);
	}

	createRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.repo = response.repo;
				this.team = response.team;
				this.users = response.users;
				callback();
			},
			{
				withEmails: [this.currentUser.email],
				withRandomEmails: 1,
				token: this.otherUserData.accessToken
			}
		);
	}

	setChannelName (callback) {
		this.channelName = 'team-' + this.team._id;
		callback();
	}

	generateMessage (callback) {
		BoundAsync.series(this, [
			this.registerUser,
			this.confirmUser
		], callback);
	}

	registerUser (callback) {
		this.registeringUser = this.users.find(user => !user.isRegistered);
		Object.assign(this.registeringUser, {
			username: RandomString.generate(12),
			password: RandomString.generate(12),
			_confirmationCheat: SecretsConfig.confirmationCheat,	// gives us the confirmation code in the response
			_forceConfirmation: true								// this forces confirmation even if not enforced in environment
		});
		this.userFactory.registerUser(
			this.registeringUser,
			(error, response) => {
				if (error) { return callback(error); }
				this.registeringUser = response.user;
				callback();
			}
		);
	}

	confirmUser (callback) {
		this.message = {
			users: [{
				_id: this.registeringUser._id,
				isRegistered: true
			}]
		};

		// confirming one of the random users created should trigger the message
		this.userFactory.confirmUser(this.registeringUser, callback);
	}
}

module.exports = ConfirmationMessageToOtherUserTest;