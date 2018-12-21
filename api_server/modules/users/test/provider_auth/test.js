// handle unit tests for the "PUT /no-auth/provider-auth/:provider" request,
// to initiate a third-party authorization flow
 
'use strict';

const ProviderAuthTest = require('./provider_auth_test');
const UnknownProviderTest = require('./unknown_provider_test');
const NoCodeTest = require('./no_code_test');

const PROVIDERS = [
	'trello',
	'github',
	'asana',
	'jira'
];

class ProviderAuthRequestTester {

	test () {
		PROVIDERS.forEach(provider => {
			new ProviderAuthTest({ provider }).test();
		});
		new UnknownProviderTest().test();
		new NoCodeTest({ provider: 'github' }).test();
	}
}

module.exports = new ProviderAuthRequestTester();