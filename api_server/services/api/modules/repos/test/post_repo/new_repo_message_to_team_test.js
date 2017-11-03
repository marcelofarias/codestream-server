'use strict';

var CodeStream_Message_Test = require(process.env.CS_API_TOP + '/services/api/modules/messager/test/codestream_message_test');
var Bound_Async = require(process.env.CS_API_TOP + '/lib/util/bound_async');

class New_Repo_Message_To_Team_Test extends CodeStream_Message_Test {

	get description () {
		return 'the team creator should receive a message with the repo when a repo is added to the team';
	}

	make_data (callback) {
		Bound_Async.series(this, [
			this.create_other_user,
			this.create_repo
		], callback);
	}

	create_other_user (callback) {
		this.user_factory.create_random_user(
			(error, response) => {
				if (error) { return callback(error);}
				this.other_user_data = response;
				callback();
			}
		);
	}

	create_repo (callback) {
		this.repo_factory.create_random_repo(
			(error, response) => {
				if (error) { return callback(error); }
				this.team = response.team;
				callback();
			},
			{
				with_emails: [this.other_user_data.user.email],
				with_random_emails: 1,
				token: this.token
			}
		);
	}

	set_channel_name (callback) {
		this.channel_name = 'team-' + this.team._id;
		callback();
	}


	generate_message (callback) {
		this.repo_factory.create_random_repo(
			(error, response) => {
				if (error) { return callback(error); }
				this.message = { repo: response.repo };
				callback();
			},
			{
				token: this.other_user_data.access_token,
				team_id: this.team._id
			}
		);
	}
}

module.exports = New_Repo_Message_To_Team_Test;
