// provide service to handle jira credential authorization for jira server (on-prem)

'use strict';

const OAuthModule = require(process.env.CS_API_TOP + '/lib/oauth/oauth_module.js');

const OAUTH_CONFIG = {
	provider: 'jiraserver',
	host: 'localhost:8080',
	apiHost: 'localhost:8080',
	usesOauth1: true,
	requestTokenPath: 'plugins/servlet/oauth/request-token',
	authorizePath: 'plugins/servlet/oauth/authorize',
	accessTokenPath: 'plugins/servlet/oauth/access-token',
	hasIssues: true,
	forEnterprise: true,
	needsConfigure: true,
	disabled: true
};

class JiraServerAuth extends OAuthModule {

	constructor (config) {
		super(config);
		this.oauthConfig = OAUTH_CONFIG;
	}
}

module.exports = JiraServerAuth;