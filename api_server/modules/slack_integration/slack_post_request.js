// fulfill an inbound-email request, called by the inbound email server to
// ingest an inbound email and turn it into a post for the stream

'use strict';

var RestfulRequest = require(process.env.CS_API_TOP + '/lib/util/restful/restful_request');
var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
var PostCreator = require(process.env.CS_API_TOP + '/modules/posts/post_creator');
var UserCreator = require(process.env.CS_API_TOP + '/modules/users/user_creator');
var AddTeamMembers = require(process.env.CS_API_TOP + '/modules/teams/add_team_members');
const Errors = require('./errors');

class SlackPostRequest extends RestfulRequest {

	constructor (options) {
		super(options);
		this.errorHandler.add(Errors);
	}

	// authorize the client (slack-bot) to make this request
	authorize (callback) {
		// FIXME: we are wide open for now
		return callback();

/*
		// we rely on a secret, known only to the slack-bot and the
		// API server ... disallowing arbitrary clients to call this request
		if (this.request.body.secret !== this.api.config.secrets.integration) {
			return callback(this.errorHandler.error('unauthorized'));
		}
		callback();
*/
	}

	// process the request...
	process(callback) {
		this.log(`Processing an inbound slack post from ${this.request.body.authorEmail}`);
		BoundAsync.series(this, [
			this.requireAllow,
			this.getTeam,
			this.getRepo,
			this.getStream,
			this.getParentPost,
			this.getOrCreateAuthor,
			this.addToTeam,
			this.createPost
		], callback);
	}

	// these parameters are required and/or optional for the request
	requireAllow (callback) {
		this.requireAllowParameters(
			'body',
			{
				required: {
					string: ['teamId', 'repoId', 'streamId', 'authorEmail', 'authorUsername', 'parentPostId', 'text'/*, 'secret'*/],
				},
				optional: {
					'array(string)': ['mentionedUsers']
				}
			},
			callback
		);
	}

	// get the team
	getTeam (callback) {
		this.data.teams.getById(
			this.request.body.teamId.toLowerCase(),
			(error, team) => {
				if (error) { return callback(error); }
				if (!team) {
					return callback(this.errorHandler.error('notFound', { info: 'team' }));
				}
				this.team = team;
				callback();
			}
		);
	}

	// get the repo
	getRepo (callback) {
		this.data.repos.getById(
			this.request.body.repoId.toLowerCase(),
			(error, repo) => {
				if (error) { return callback(error); }
				if (!repo) {
					return callback(this.errorHandler.error('notFound', { info: 'repo' }));
				}
				this.repo = repo;
				if (repo.get('teamId') !== this.team.id) {
					return callback(this.errorHandler.error('repoNoMatchTeam'));
				}
				callback();
			}
		);
	}

	// get the stream
	getStream (callback) {
		this.data.streams.getById(
			this.request.body.streamId.toLowerCase(),
			(error, stream) => {
				if (error) { return callback(error); }
				if (!stream) {
					return callback(this.errorHandler.error('notFound', { info: 'stream' }));
				}
				this.stream = stream;
				if (stream.get('repoId') !== this.repo.id) {
					return callback(this.errorHandler.error('streamNoMatchRepo'));
				}
				callback();
			}
		);
	}

	// get the parent post
	getParentPost (callback) {
		this.data.posts.getById(
			this.request.body.parentPostId.toLowerCase(),
			(error, parentPost) => {
				if (error) { return callback(error); }
				if (!parentPost) {
					return callback(this.errorHandler.error('notFound', { info: 'parent post' }));
				}
				this.parentPost = parentPost;
				if (parentPost.get('streamId') !== this.stream.id) {
					return callback(this.errorHandler.error('parentPostNoMatchStream'));
				}
				callback();
			}
		);
	}

	// if we can't find the author (by matching email), we'll create one as part of the team
	getOrCreateAuthor (callback) {
		const user = {
			email: this.request.body.authorEmail,
			username: this.request.body.authorUsername,
		};
		this.userCreator = new UserCreator({
			request: this,
			dontSaveIfExists: true,
			ignoreUsernameOnConflict: true,	// if there is a username conflict, just ignore the username coming from slack
			teamIds: [this.team.id]			// user will be added directly to the team if it is a new user
		}, {
		});
		this.userCreator.createUser(
			user,
			(error, userCreated) => {
				if (error) { return callback(error); }
				this.author = userCreated;
				process.nextTick(callback);
			}
		);
	}

	// if we couldn't find a matching author, we created one, and now we need to
	// add them to the team
	addToTeam (callback) {
		// check if a user we found is a member of the team already, if not, add them
		if (
			!this.userCreator.existingModel ||
			this.userCreator.existingModel.hasTeam(this.team.id)
		) {
			return callback();
		}
		// add the author of the post to the team, this will only fail if there is
		// a username conflict with an existing user on the team ... still not sure
		// what to do about that case
		let adder = new AddTeamMembers({
			request: this,
			users: [this.author],
			teamId: this.team.id
		});
		this.addedToTeam = true;
		adder.addTeamMembers(callback);
	}

	// create a post for this slack-post in our stream
	createPost (callback) {
		this.user = this.author;
		this.postCreator = new PostCreator({
			request: this,
			forIntegration: 'Slack'
		});
		this.postCreator.createPost({
			streamId: this.stream.id,
			text: this.request.body.text,
			parentPostId: this.parentPost.id,
			origin: 'slack'
		}, error => {
			if (error) { return callback(error); }
			this.post = this.postCreator.model;
			this.responseData.post = this.post.getSanitizedObject();
			if (!this.userCreator.existingModel || this.addedToTeam) {
				this.responseData.users = [this.userCreator.model.getSanitizedObject()];
			}
			callback();
		});
	}

	// after the post is created...
	postProcess (callback) {
		this.postCreator.postCreate(callback);
	}
}

module.exports = SlackPostRequest;