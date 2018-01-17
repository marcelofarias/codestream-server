'use strict';

var GetPostsTest = require('./get_posts_test');
var ObjectID = require('mongodb').ObjectID;

class StreamNotFoundTest extends GetPostsTest {

	get description () {
		return 'should return an error when trying to fetch posts from a stream that doesn\'t exist';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1003',
			info: 'stream'
		};
	}

	// set the path to use in the fetch request
	setPath (callback) {
		// provide some random non-existent stream ID
		let streamId = ObjectID();
		this.path = `/posts?teamId=${this.team._id}&streamId=${streamId}`;
		callback();
	}
}

module.exports = StreamNotFoundTest;