'use strict';

var PostCodeToFileStreamTest = require('./post_code_to_file_stream_test');

class InvalidCoordinateObjectTest extends PostCodeToFileStreamTest {

	get description () {
		return 'should return error when attempting to create a post with a code block element where the fifth location coordinate is not an object';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
			info: 'codeBlocks: fifth element of location must be an object'
		};
	}

	// form the data to use in trying to create the post
	makePostData (callback) {
		// add a fifth coordinate element that is not an object ... not allowed!
		super.makePostData(() => {
			this.data.codeBlocks[0].location = [1, 2, 3, 4, 5];
			callback();
		});
	}
}

module.exports = InvalidCoordinateObjectTest;