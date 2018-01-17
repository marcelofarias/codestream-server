// handle unit tests for the "GET /posts/:id" request

'use strict';

var GetPostTest = require('./get_post_test');
var NotFoundTest = require('./not_found_test');
var ACLTest = require('./acl_test');

class GetPostRequestTester {

	getPostTest () {
		new GetPostTest({type: 'channel', mine: true}).test();
		new GetPostTest({type: 'direct', mine: true}).test();
		new GetPostTest({type: 'file', mine: true}).test();
		new GetPostTest({type: 'channel'}).test();
		new GetPostTest({type: 'direct'}).test();
		new GetPostTest({type: 'file'}).test();
		new NotFoundTest().test();
		new ACLTest({ type: 'direct' }).test();
		new ACLTest({ type: 'channel' }).test();
		new ACLTest({ type: 'file' }).test();
	}
}

module.exports = GetPostRequestTester;