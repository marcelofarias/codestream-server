'use strict';

const CodeStreamMessageTest = require(process.env.CS_API_TOP + '/modules/messager/test/codestream_message_test');
const Aggregation = require(process.env.CS_API_TOP + '/server_utils/aggregation');
const CommonInit = require('./common_init');
const Assert = require('assert');

class TrackingTest extends Aggregation(CodeStreamMessageTest, CommonInit) {

	get description () {
		return 'should send a Team Member Invited event for tracking purposes when a user is invited';
	}

	// make the data the will be used when issuing the request that triggers the message
	makeData (callback) {
		this.init(callback);
	}

	// set the channel name to listen for the email message on
	setChannelName (callback) {
		// for the user originating the request, we use their me-channel
		// we'll be sending the data that we would otherwise send to the tracker
		// service (mixpanel) on this channel, and then we'll validate the data
		this.channelName = `user-${this.currentUser._id}`;
		callback();
	}

	// generate the message by issuing a request
	generateMessage (callback) {
		// initiate the request, this should trigger a publish of the tracker message
		this.doApiRequest(
			{
				method: 'post',
				path: '/users',
				data: this.data,
				testTracking: true,
				reallyTrack: true,
				token: this.token
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.createdUser = response.user;
				callback();
			}
		);
	}

	// validate the message received from pubnub
	validateMessage (message) {
		message = message.message;
		if (message.type !== 'track') {
			return false;
		}
		const data = message.data;
		const registered = !!this.existingUserIsRegistered;
		const firstInvite = !this.subsequentInvite;
		const errors = [];
		const result = (
			((message.event === 'Team Member Invited') || errors.push('event not correct')) &&
			((data.distinct_id === this.currentUser._id) || errors.push('distinct_id not set to request originator\'s ID')) &&
			((data['Email Address'] === this.createdUser.email) || errors.push('Email Address does not match request originator')) &&
			((data['First Invite'] === firstInvite) || errors.push('First Invite not correct')) &&
			((data['Registered'] === registered) || errors.push('Registered not correct'))
		);
		Assert(result === true && errors.length === 0, 'response not valid: ' + errors.join(', '));
		return true;
	}
}

module.exports = TrackingTest;