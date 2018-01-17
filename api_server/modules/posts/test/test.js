// handle unit tests for the posts module

'use strict';

// make jshint happy
/* globals describe */

var PostsRequestTester = require('./posts_request_tester');

var postsRequestTester = new PostsRequestTester();

describe('post requests', function() {

	this.timeout(60000);

	describe('GET /posts/:id', postsRequestTester.getPostTest);
	describe('GET /posts', postsRequestTester.getPostsTest);
	describe('POST /posts', postsRequestTester.postPostTest);
	describe('email notifications', postsRequestTester.emailNotificationTest);
});