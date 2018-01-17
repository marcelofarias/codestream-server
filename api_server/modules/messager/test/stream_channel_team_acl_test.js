'use strict';

var CodeStreamMessageACLTest = require('./codestream_message_acl_test');
var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');

class StreamChannelTeamACLTest extends CodeStreamMessageACLTest {

	get description () {
		return 'should get an error when trying to subscribe to a stream channel for a team i am not a member of';
	}

	// make the data needed to prepare for the request that triggers the message
	makeData (callback) {
		BoundAsync.series(this, [
			this.createRepo,	// create a repo, the "other" user will not be in this stream
			this.createStream	// create a stream in that repo
		], callback);
	}

	// create a random repo, leaving out the "other" user
	createRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.team = response.team;
				this.users = response.users;
				callback();
			},
			{
				withRandomEmails: 2,	// add a few random users
				token: this.token		// i am the creator
			}
		);
	}

	// create a stream, with all the users from the team
	createStream (callback) {
		this.streamFactory.createRandomStream(
			(error, response) => {
				if (error) { return callback(error); }
				this.stream = response.stream;
				callback();
			},
			{
				type: 'channel',
				teamId: this.team._id,
				memberIds: this.users.map(user => user._id),
				token: this.token
			}
		);
	}

	// set the channel name to listen on
	setChannelName (callback) {
		// listening on the stream channel for this stream
		this.channelName = 'stream-' + this.stream._id;
		callback();
	}
}

module.exports = StreamChannelTeamACLTest;