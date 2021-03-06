'use strict';

const GetCodemarksTest = require('./get_codemarks_test');

class GetCodemarksAfterInclusiveTest extends GetCodemarksTest {

	get description () {
		return 'should return the correct codemarks when requesting codemarks in a stream after a timestamp, inclusive';
	}

	// set the path to use for the request
	setPath (callback) {
		// pick a pivot point, then filter our expected codemarks based on that pivot,
		// and specify the after parameter to fetch based on the pivot
		const pivot = this.codemarks[5].createdAt;
		this.expectedCodemarks = this.codemarks.filter(codemark => codemark.createdAt >= pivot);
		this.expectedCodemarks.reverse();
		this.path = `/codemarks?teamId=${this.team.id}&after=${pivot}&inclusive`;
		callback();
	}
}

module.exports = GetCodemarksAfterInclusiveTest;
