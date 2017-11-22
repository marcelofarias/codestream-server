'use strict';

var BoundAsync = require(process.env.CS_API_TOP + '/lib/util/bound_async');

class UsernameChecker  {

	constructor (options) {
		Object.assign(this, options);
		this.username = this.username.toLowerCase();
	}

	checkUsernameUnique (callback) {
		BoundAsync.series(this, [
			this.getUsers,
			this.arrangeUsernamesByTeam,
			this.checkUniqueness
		], (error) => {
			callback(error, this.isUnique);
		});
	}

	getUsers (callback) {
		let query = {
			deactivated: false,
			teamIds: { $in: this.teamIds }
		};
		this.data.users.getByQuery(
			query,
			(error, users) => {
				if (error) { return callback(error); }
				this.users = users;
				callback();
			},
			{
				databaseOptions: {
					fields: ['username', 'teamIds'],
				},
				noCache: true
			}
		);
	}

	arrangeUsernamesByTeam (callback) {
		this.usernamesByTeam = {};
		BoundAsync.forEach(
			this,
			this.users,
			this.arrangeUsernameByTeam,
			callback
		);
	}

	arrangeUsernameByTeam (user, callback) {
		if (user._id === this.userId || !user.username) {
			return callback();
		}
		user.teamIds.forEach(teamId => {
			this.usernamesByTeam[teamId] = this.usernamesByTeam[teamId] || [];
			this.usernamesByTeam[teamId].push(user.username.toLowerCase());
		});
		process.nextTick(callback);
	}

	checkUniqueness (callback) {
		this.notUniqueTeamIds = [];
		Object.keys(this.usernamesByTeam).forEach(teamId => {
			if (this.usernamesByTeam[teamId].indexOf(this.username) !== -1) {
				this.notUniqueTeamIds.push(teamId);
			}
		});
		this.isUnique = this.notUniqueTeamIds.length === 0;
		process.nextTick(callback);
	}
}

module.exports = UsernameChecker;