'use strict';

const NumRepliesMessageToStreamTest = require('./num_replies_message_to_stream_test');

class NumRepliesToCodemarkMessageTest extends NumRepliesMessageToStreamTest {

	get description () {
		return `members of a ${this.type} stream should receive the updated codemark with numReplies incremented along with the updated parent post when a reply is created to a post with an codemark`;
	}

	setTestOptions (callback) {
		super.setTestOptions(() => {
			this.postOptions.wantCodemark = true;
			callback();
		});
	}

	// generate the message by issuing a request
	generateMessage (callback) {
		// add updated codemark op to the message we expect
		super.generateMessage(error => {
			if (error) { return callback(error); }
			this.message.codemark = {
				_id: this.postData[0].codemark._id,
				$set: { 
					numReplies: 2,
					version: 3
				},
				$version: {
					before: 2,
					after: 3
				}
			};
			callback();
		});
	}
}

module.exports = NumRepliesToCodemarkMessageTest;