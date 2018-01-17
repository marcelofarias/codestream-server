'use strict';

var PostFileStreamTest = require('./post_file_stream_test');

class InvalidTypeTest extends PostFileStreamTest {

	get description () {
		return 'should return an error when attempting to create a stream of an invalid type';
	}

	getExpectedFields () {
		return null;
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
			info: [{
				code: 'STRM-1000'
			}]
		};
	}

	before (callback) {
		super.before(error => {
			if (error) { return callback(error); }
			this.data.type = 'sometype';
			callback();
		});
	}
}

module.exports = InvalidTypeTest;