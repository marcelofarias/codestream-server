'use strict';

var CodeBlockFromDifferentStreamTest = require('./code_block_from_different_stream_test');

class NoCommitHashWithFileTest extends CodeBlockFromDifferentStreamTest {

	constructor (options) {
		super(options);
		this.streamType = 'channel';
		this.noMarkerExpected = true;
	}

	get description () {
		return 'should be ok to create a post with a code block but not providing a commit hash even if there is a file';
	}

	// form the data to use in trying to create the post
	makePostData (callback) {
		// remove the commit hash from the data to use in creating the post
		// also remove the stream ID, making the statement that we are not associating the code block with a stream at all...
		// also add a file ... with to stream, this file still shows up with the code block, but is not associate with a stream
		super.makePostData(() => {
			delete this.data.commitHashWhenPosted;
			delete this.data.codeBlocks[0].streamId;	
			this.data.codeBlocks[0].file = this.streamFactory.randomFile();
			callback();
		});
	}
}

module.exports = NoCommitHashWithFileTest;