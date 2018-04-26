// base class for inbound email tests, using "POST /no-auth/inbound-email" request

'use strict';

var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const MSTeams = require(process.env.CS_API_TOP + '/config/msteams');

class CommonInit {

	init (callback) {
		BoundAsync.series(this, [
			this.createPostOriginator,	// create a user who will simulate being the sender of the email
			this.createRepo,			// create the repo (and team) to be used in the test
			this.createStream,			// create the stream in the repo
			this.createParentPost,		// create the post to which the teams post will be a reply
			this.makePostData			// make the data to use in the request that triggers the message
		], callback);
	}

	// create a user who will simulate being the originator of the teams post
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
		let emails = this.dontIncludeOtherUser ? [] : [this.postOriginatorData.user.email];
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.company = response.company;
				this.team = response.team;
				this.repo = response.repo;
				this.users = response.users;
				callback();
			},
			{
				withEmails: emails,
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
				token: this.token // "current user" will create the stream
			}
		);
	}

	// create the parent post to which the teams post will be a reply
	createParentPost (callback) {
		this.postFactory.createRandomPost(
			(error, response) => {
				if (error) { return callback(error); }
				this.parentPost = response.post;
				callback();
			},
			{
				streamId: this.stream._id,
				token: this.token // "current user" will create the parent post (but the child post will be the "post originator")
			}
		);
	}

	// make the data to be used in the request that triggers the message
	makePostData (callback) {
		this.data = {
			teamId: this.team._id,
			repoId: this.repo._id,
			streamId: this.stream._id,
			authorEmail: this.postOriginatorData.user.email,
			authorUsername: this.postOriginatorData.user.username,
			parentPostId: this.parentPost._id,
			text: this.postFactory.randomText(),
			secret: MSTeams.secret
		};
		callback();
	}
}

module.exports = CommonInit;