'use strict';

var PostReplyTest = require('./post_reply_test');
var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
var Assert = require('assert');

class HasRepliesTest extends PostReplyTest {

	get description () {
		return 'parent post should get hasReplies set when the first reply is created for that post';
	}

	// run the test...
	run (callback) {
		BoundAsync.series(this, [
			super.run,	// this posts the reply and checks the result, but then...
			this.checkParentPost	// ...we'll check the parent post as well
		], callback);
	}

	// check the parent post for hasReplies being set
	checkParentPost (callback) {
		// get the marker for the code block
		this.doApiRequest(
			{
				method: 'get',
				path: '/posts/' + this.otherPostData.post._id,
				token: this.token
			},
			(error, response) => {
				if (error) { return callback(error); }
				// confirm the hasReplies attribute has been set
				Assert.equal(response.post.hasReplies, true, 'hasReplies is not set to true');
				callback();
			}
		);
	}
}

module.exports = HasRepliesTest;