'use strict';

var CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');

/*
CodeStreamAPITest handles setting up a user with a valid access token, and by default
sends the access token with the request ... we'll just issue a request for the user's
own user object (/users/me) and confirm it workers
*/

class AuthenticationTest extends CodeStreamAPITest {

	get description () {
		return 'should allow access to resources when a valid access token is supplied';
	}

	get method () {
		return 'get';
	}

	get path () {
		return '/users/me';
	}
}

module.exports = AuthenticationTest;