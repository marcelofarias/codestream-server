// test constants for testing the companies module

'use strict';

const CompanyAttributes = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/modules/companies/company_attributes');

const EXPECTED_COMPANY_FIELDS = [
	'id',
	'name',
	'deactivated',
	'createdAt',
	'modifiedAt',
	'creatorId'
];

const UNSANITIZED_ATTRIBUTES = Object.keys(CompanyAttributes).filter(attribute => {
	return CompanyAttributes[attribute].serverOnly;
});

module.exports = {
	EXPECTED_COMPANY_FIELDS,
	UNSANITIZED_ATTRIBUTES
};
