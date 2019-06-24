// handle unit tests for the "GET /users" request

'use strict';

const GetUsersByIdTest = require('./get_users_by_id_test');
const TeamIDRequiredTest = require('./team_id_required_test');
const GetUsersByTeamIdTest = require('./get_users_by_team_id_test');
const ACLTest = require('./acl_test');
const GetUsersOnlyFromTeamTest = require('./get_users_only_from_team_test');

class GetUsersRequestTester {

	getUsersTest () {
		new GetUsersByIdTest().test();
		new GetUsersByTeamIdTest().test();
		new TeamIDRequiredTest().test();
		new ACLTest().test();
		new GetUsersOnlyFromTeamTest().test();
	}
}

module.exports = GetUsersRequestTester;