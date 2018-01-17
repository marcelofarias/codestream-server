'use strict';

var CodeStreamMessageTest = require(process.env.CS_API_TOP + '/modules/messager/test/codestream_message_test');
var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const EmailConfig = require(process.env.CS_API_TOP + '/config/email');
const Secrets = require(process.env.CS_API_TOP + '/config/secrets');

class InboundEmailMessageTest extends CodeStreamMessageTest {

	get description () {
		return 'should create and publish a post when an inbound email call is made';
	}

	// make the data that triggers the message to be received
	makeData (callback) {
		BoundAsync.series(this, [
			this.createPostOriginator,	// create a user who will simulate being the sender of the email
			this.createRepo,	// create the repo (and team) to be used in the test
			this.createStream,	// create the stream in the repo
			this.makePostData	// make the data to use in the request that triggers the message
		], callback);
	}

	// create a user who will simulate being the originator of the email
	createPostOriginator (callback) {
		this.userFactory.createRandomUser(
			(error, response) => {
				if (error) { return callback(error);}
				this.postOriginatorData = response;
				callback();
			}
		);
	}

	// create the repo to use in the test
	createRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.team = response.team;
				this.repo = response.repo;
				callback();
			},
			{
				withEmails: [
					this.postOriginatorData.user.email,
				],	// include the post originator in the team
				withRandomEmails: 1,	// include another random user for good measure
				token: this.token	// "i" will create the repo
			}
		);
	}

	// create a file-type stream in the repo
	createStream (callback) {
		this.streamFactory.createRandomStream(
			(error, response) => {
				if (error) { return callback(error); }
				this.stream = response.stream;
				callback();
			},
			{
				type: 'file',
				teamId: this.team._id,
				repoId: this.repo._id,
				token: this.token // "i" will create the stream
			}
		);
	}

	// set the name of the channel we expect to receive a message on
	setChannelName (callback) {
		// it is the team channel
		this.channelName = 'team-' + this.team._id;
		callback();
	}

	// make the data to be used in the request that triggers the message
	makePostData (callback) {
		let toEmail = `${this.stream._id}.${this.team._id}@${EmailConfig.replyToDomain}`;
		this.emailData = {
			to: [{ address: toEmail }],
			from: { address: this.postOriginatorData.user.email },
			text: this.postFactory.randomText(),
			mailFile: 'somefile',	// doesn't really matter
			secret: Secrets.mail,
			attachments: []
		};
		callback();
	}

	// generate the message by issuing a request
	generateMessage (callback) {
		// simulate an inbound email by calling the API server's inbound-email
		// call with post data, this should trigger post creation and a publish
		// of the post through the team channel
		this.doApiRequest(
			{
				method: 'post',
				path: '/no-auth/inbound-email',
				data: this.emailData
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.message = response;	// we expect the same info through pubnub
				callback();
			}
		);
	}
}

module.exports = InboundEmailMessageTest;