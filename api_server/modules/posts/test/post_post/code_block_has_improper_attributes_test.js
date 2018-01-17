'use strict';

var PostCodeToFileStreamTest = require('./post_code_to_file_stream_test');

class CodeBlockHasImproperAttributesTest extends PostCodeToFileStreamTest {

	get description () {
		return 'should return an error when attempting to create a post with a code block element where an improper attribute is provided';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
			info: 'codeBlocks: improper attributes'
		};
	}

	// form the data to use in trying to create the post
	makePostData (callback) {
		// we'll add a code block and add some invalid attribute to it
		super.makePostData(() => {
			this.data.codeBlocks[0].someAttribute = 1;
			callback();
		});
	}
}

module.exports = CodeBlockHasImproperAttributesTest;