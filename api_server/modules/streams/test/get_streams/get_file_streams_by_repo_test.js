'use strict';

var GetStreamsTest = require('./get_streams_test');

class GetFileStreamsByRepoTest extends GetStreamsTest {

	get description () {
		return 'should return the correct streams when requesting file streams by repo ID';
	}

	setPath (callback) {
		let repoId = this.myRepo._id;
		let teamId = this.myTeam._id;
		this.myStreams = this.streamsByRepo[repoId];
		this.path = `/streams?type=file&repoId=${repoId}&teamId=${teamId}`;
		callback();
	}
}

module.exports = GetFileStreamsByRepoTest;