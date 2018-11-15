'use strict';

const Aggregation = require(process.env.CS_API_TOP + '/server_utils/aggregation');
const CodeStreamMessageTest = require(process.env.CS_API_TOP + '/modules/messager/test/codestream_message_test');
const CommonInit = require('./common_init');
const DeletePostTest = require('./delete_post_test');

class MessageTest extends Aggregation(CodeStreamMessageTest, CommonInit, DeletePostTest) {

	get description () {
		return `members of the team or stream should receive a message with the deactivated post when a codemark attached to a post is deleted in a ${this.streamType} stream`;
	}

	// make the data that triggers the message to be received
	makeData (callback) {
		this.init(callback);
	}

	// set the name of the channel we expect to receive a message on
	setChannelName (callback) {
		// for channels and directs the message comes on the stream channel
		if (this.stream.isTeamStream) {
			this.channelName = `team-${this.team._id}`;
		}
		else {
			this.channelName = `stream-${this.stream._id}`;
		}
		callback();
	}

	// generate the message by issuing a request
	generateMessage (callback) {
		// do the delete, this should trigger a message to the
		// stream channel with the updated codemark and post
		this.deleteCodemark(callback);
	}
}

module.exports = MessageTest;