// handle unit tests for the "DELETE /codemarks/:d" request to delete a knowledge base codemark

'use strict';

const DeleteCodemarkTest = require('./delete_codemark_test');
const DeleteCodemarkFetchTest = require('./delete_codemark_fetch_test');
const DeleteMarkerTest = require('./delete_marker_test');
const DeleteMarkerFetchTest = require('./delete_marker_fetch_test');
const DeletePostTest = require('./delete_post_test');
const DeletePostFetchTest = require('./delete_post_fetch_test');
const DeletePostAndMarkerTest = require('./delete_post_and_marker_test');
const DeletePostAndMarkerFetchTest = require('./delete_post_and_marker_fetch_test');
const ACLTest = require('./acl_test');
const ACLTeamTest = require('./acl_team_test');
const CodemarkNotFoundTest = require('./codemark_not_found_test');
const AlreadyDeletedTest = require('./already_deleted_test');
const AdminCanDeleteTest = require('./admin_can_delete_test');
const MessageTest = require('./message_test');
const MarkerMessageTest = require('./marker_message_test');
const DeletePostMessageTest = require('./delete_post_message_test');
const DeletePostAndMarkerMessageTest = require('./delete_post_and_marker_message_test');
const MarkerToTeamMessageTest = require('./marker_to_team_message_test');

class DeleteCodemarkRequestTester {

	test () {
		new DeleteCodemarkTest().test();
		new DeleteCodemarkFetchTest().test();
		new DeleteMarkerTest().test();
		new DeleteMarkerFetchTest().test();
		new DeletePostTest().test();
		new DeletePostFetchTest().test();
		new DeletePostAndMarkerTest().test();
		new DeletePostAndMarkerFetchTest().test();
		new ACLTest().test();
		new ACLTeamTest().test();
		new CodemarkNotFoundTest().test();
		new AlreadyDeletedTest().test();
		new AdminCanDeleteTest().test();
		new MessageTest().test();
		new MarkerMessageTest().test();
		new DeletePostMessageTest({ streamType: 'channel' }).test();
		new DeletePostMessageTest({ streamType: 'direct' }).test();
		new DeletePostMessageTest({ streamType: 'team stream' }).test();
		new DeletePostAndMarkerMessageTest({ streamType: 'channel' }).test();
		new DeletePostAndMarkerMessageTest({ streamType: 'direct' }).test();
		new DeletePostAndMarkerMessageTest({ streamType: 'team stream' }).test();
		new MarkerToTeamMessageTest({ streamType: 'channel' }).test();
		new MarkerToTeamMessageTest({ streamType: 'direct' }).test();
	}
}

module.exports = new DeleteCodemarkRequestTester();