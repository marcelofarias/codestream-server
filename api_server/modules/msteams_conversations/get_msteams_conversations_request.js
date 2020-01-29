// handle the "GET /users" request to fetch several users

'use strict';

const GetManyRequest = require(process.env.CS_API_TOP + '/lib/util/restful/get_many_request');
const Indexes = require('./indexes');

class GetMSTeamsConversationsRequest extends GetManyRequest {

	async authorize () {
		// members of the same team can fetch each other
		await this.user.authorizeFromTeamId(this.request.query, this);
	}

	async preQueryHook () {
		this.teamId = decodeURIComponent(this.request.query.teamId || '');
		const tenantId = decodeURIComponent(this.request.query.tenantId || '');

		if (!this.teamId) {
			return this.errorHandler.error('parameterRequired', { info: 'teamId' });
		}
		// tenantId is the id that MS assigns the organization
		if (!tenantId) {
			return this.errorHandler.error('parameterRequired', { info: 'tenantId' });
		}
		
		const team = await this.data.teams.getById(this.teamId);
		this.tenantId = this.isConnected(team, tenantId);
	}

	buildQuery () {
		// if we don't have a tenantId based on this team, then we aren't connected
		if (!this.tenantId) return null;

		const query = {
			teamId: this.teamId.toLowerCase(),
			tenantId: this.tenantId
		};
		return query;
	}

	// get options to use in the query to fetch users
	getQueryOptions () {
		// provide appropriate index, by teamId & tenantId
		return {
			hint: Indexes.byTeamIdTenantIds
		};
	}

	// is this team and tenant connected?
	isConnected (team, tenantId) {
		if (!team || team.get('deactivated')) return undefined;

		const providerIdentities = team.get('providerIdentities');
		if (!providerIdentities) return undefined;

		const msteam = providerIdentities.find(_ => _ === `msteams::${tenantId}`);
		if (!msteam) return undefined;

		const providerInfo = team.get('providerBotInfo');
		if (!providerInfo) return undefined;

		if (providerInfo.msteams.tenantId &&
			providerInfo.msteams.data &&
			providerInfo.msteams.data.connected) {
			return providerInfo.msteams.tenantId;
		}
		return undefined;
	}
	
	// describe this route for help
	static describe (module) {
		const description = GetManyRequest.describe(module);
		description.access = 'User must be a member of the team for which MS Teams teams/conversations are being fetched';
		description.description = 'Fetch the MS Teams teams/conversations for a CodeStream team',
		Object.assign(description.input.looksLike, {
			'teamId*': '<ID of the CodeStream team for which MS Teams teams/conversations are being fetched>',
			'tenantId*': '<ID of the MS Teams tenant (organization)>'			
		});

		return description;
	}
}

module.exports = GetMSTeamsConversationsRequest;
