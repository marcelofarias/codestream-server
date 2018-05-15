'use strict';

const CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
const RandomString = require('randomstring');
const BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');

class ChangePasswordTest extends CodeStreamAPITest {

	get description () {
		return 'should set a new password hash when the user changes their password';
	}

	get method () {
		return 'put';
	}

	get path () {
		// when dontLoginToVerify is specified, we're not doing a login to verify
		// the passowrd hash was correctly written; in this case the test itself
		// is just changing the password
		return this.dontLoginToVerify ? '/password' : '/no-auth/login';
	}

	// before the test runs...
	before (callback) {
		BoundAsync.series(this, [
			this.setData,	    // set the data to use when changing password
			this.changePassword	// change the password using previously set data
		], callback);
	}

	// set the data to use when changing password
	setData (callback) {
		this.passwordData = { 
			existingPassword: this.currentUserPassword,
			newPassword: RandomString.generate(12)
		};
		callback();
	}

	// change the password with a request to the server
	changePassword (callback) {
		if (this.dontLoginToVerify) {
			// the test will be setting the password itself, not verifying with a login
			// so don't do anything here
			this.data = this.passwordData;
			return callback();
		}
		else {
			// this is the data we'll use for the /no-auth/login request, to confirm the
			// password took
			this.data = {
				email: this.currentUser.email,
				password: this.passwordData.newPassword
			};
		}
		this.doApiRequest(
			{
				method: 'put',
				path: '/password',
				data: this.passwordData,
				token: this.token
			},
			callback
		);
	}
}

module.exports = ChangePasswordTest;