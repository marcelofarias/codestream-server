// handle unit tests for the "PUT /password" request for a user to change their password 

'use strict';

const ChangePasswordTest = require('./change_password_test');
const OldPasswordFailsTest = require('./old_password_fails_test');
const RequiredParameterTest = require('./required_parameter_test');
const InvalidPasswordTest = require('./invalid_password_test');
const BadPasswordTest = require('./bad_password_test');
const AccessTokenTest = require('./access_token_test');
const OldTokenInvalidTest = require('./old_token_invalid_test');

class ChangePasswordRequestTester {

	test () {
		new ChangePasswordTest().test();
		new OldPasswordFailsTest().test();
		new RequiredParameterTest({ parameter: 'newPassword' }).test();
		new RequiredParameterTest({ parameter: 'existingPassword' }).test();
		new InvalidPasswordTest().test();
		new BadPasswordTest().test();
		new AccessTokenTest().test();
		new OldTokenInvalidTest().test();
	}
}

module.exports = new ChangePasswordRequestTester();
