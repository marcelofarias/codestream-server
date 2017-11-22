'use strict';

var GetPostsTest = require('./get_posts_test');

class GetPostsByIdTest extends GetPostsTest {

	get description () {
		return 'should return the correct posts when requesting posts by ID';
	}

	setPath (callback) {
		this.myPosts = [
			this.myPosts[0],
			this.myPosts[2],
			this.myPosts[3]
		];
		let ids = this.myPosts.map(post => post._id);
		this.path = `/posts?teamId=${this.team._id}&streamId=${this.stream._id}&ids=${ids}`;
		callback();
	}
}

module.exports = GetPostsByIdTest;