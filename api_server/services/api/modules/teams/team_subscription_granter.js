'use strict';

var BoundAsync = require(process.env.CS_API_TOP + '/lib/util/bound_async');

class TeamSubscriptionGranter  {

	constructor (options) {
		Object.assign(this, options);
	}

	grantToMembers (callback) {
		BoundAsync.series(this, [
			this.getUsers,
			this.determineRegisteredUsers,
			this.grantTeamChannel
		], callback);
	}

	getUsers (callback) {
		if (this.members) {
			return callback();
		}
		this.data.users.getByIds(
			this.team.get('memberIds') || [],
			(error, members) => {
				if (error) { return callback(error); }
				this.members = members;
				callback();
			},
			{
				fields: ['isRegistered']
			}
		);
	}

	determineRegisteredUsers (callback) {
		this.registeredUsers = [];
		BoundAsync.forEachLimit(
			this,
			this.members,
			10,
			this.determineRegisteredUser,
			callback
		);
	}

	determineRegisteredUser (user, callback) {
		if (user.get('isRegistered')) {
			this.registeredUsers.push(user);
		}
		callback();
	}

	grantTeamChannel (callback) {
		var userIds = this.registeredUsers.map(user => user.id);
		if (userIds.length === 0) {
			return callback();
		}
		let channel = 'team-' + this.team.id;
		this.messager.grant(
			userIds,
			channel,
			(error) => {
				if (error) {
					 return callback(`unable to grant permissions for subscription (${channel}): ${error}`);
				}
				else {
					return callback();
				}
			}
		);
	}
}

module.exports = TeamSubscriptionGranter;