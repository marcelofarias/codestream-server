'use strict';

const PutTeamTest = require('./put_team_test');
const BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const Assert = require('assert');
const PubNub = require('pubnub');
const PubNubConfig = require(process.env.CS_API_TOP + '/config/pubnub');
const PubNubClient = require(process.env.CS_API_TOP + '/server_utils/pubnub/pubnub_client.js');

class TeamSubscriptionRevokedTest extends PutTeamTest {

	get description () {
		return 'users removed from a team should no longer be able to subscribe to the team channel for that team';
	}

	getExpectedFields () {
		let fields = super.getExpectedFields();
		return {
			team: {
				$set: fields.team,
				$pull: ['memberIds']
			}
		};
	}

	// run the actual test...
	run (callback) {
		// do the normal test, removing the current user, but afterwards try to
		// subscribe to the team channel, which should fail
		BoundAsync.series(this, [
			super.run,
			this.trySubscribeToTeam
		], callback);
	}

	// form the data for the team update
	makeTeamData (callback) {
		// remove another user from the team, that user will then try to subscribe
		super.makeTeamData(() => {
			this.data.$pull = {
				memberIds: this.otherUserData[0].user._id
			};
			callback();
		});
	}

	// try to subscribe to the team channel
	trySubscribeToTeam (callback) {
		const clientConfig = Object.assign({}, PubNubConfig);
		delete clientConfig.secretKey;
		delete clientConfig.publishKey;
		clientConfig.uuid = this.currentUser._pubnubUuid || this.currentUser._id;
		clientConfig.authKey = this.otherUserData[0].accessToken;
		const client = new PubNub(clientConfig);
		const pubnubClient = new PubNubClient({
			pubnub: client
		});
		pubnubClient.subscribe(
			`team-${this.team._id}`,
			() => {
				Assert.fail('message received on team channel');
			},
			error => {
				Assert(error, 'subscription to team channel was successful');
				callback();
			}
		);
	}

	validateResponse (data) {
		super.validateResponse(data, true);
	}
}

module.exports = TeamSubscriptionRevokedTest;