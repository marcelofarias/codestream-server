'use strict';

var RegistrationTest = require('./registration_test');
var RandomString = require('randomstring');

class BadUsernameTest extends RegistrationTest {

	get description () {
		return 'should return an invalid username error when registering with a bad username';
	}

	getExpectedFields () {
		return null;
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
   			info: [{
				username: 'can only contain .*'
			}]
		};
	}

	before (callback) {
		this.data = this.userFactory.getRandomUserData();
		this.data.username = RandomString.generate(12) + '%';
		callback();
	}
}

module.exports = BadUsernameTest;