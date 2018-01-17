'use strict';

var GetManyRequest = require(process.env.CS_API_TOP + '/lib/util/restful/get_many_request');
const Indexes = require('./indexes');

class GetReposRequest extends GetManyRequest {

	authorize (callback) {
		this.user.authorizeFromTeamId(this.request.query, this, callback);
	}

	buildQuery () {
		if (!this.request.query.teamId) {
			return this.errorHandler.error('parameterRequired', { info: 'teamId' });
		}
		let query = {
			teamId: decodeURIComponent(this.request.query.teamId).toLowerCase()
		};
		if (this.request.query.ids) {
			let ids = decodeURIComponent(this.request.query.ids).toLowerCase().split(',');
			query._id = this.data.repos.inQuerySafe(ids);
		}
		return query;
	}

	getQueryOptions () {
		return {
			databaseOptions: {
				hint: Indexes.byTeamId
			}
		};
	}
}

module.exports = GetReposRequest;