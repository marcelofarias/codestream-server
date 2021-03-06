'use strict';

const GetPostsTest = require('./get_posts_test');
const Assert = require('assert');

class GetPostsWithCodemarksTest extends GetPostsTest {

	constructor (options) {
		super(options);
		this.postOptions.wantCodemark = true;
	}

	get description () {
		return 'should return the correct posts with codemarks when requesting posts created with knowledge base codemark attachments';
	}

	// validate the response to the fetch request
	validateResponse (data) {
		data.posts.forEach(post => {
			const codemark = data.codemarks.find(codemark => codemark.id === post.codemarkId);
			Assert(codemark, 'codemark not returned with post');
		});
		super.validateResponse(data);
	}
}

module.exports = GetPostsWithCodemarksTest;
