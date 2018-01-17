'use strict';

var GetCompanyTest = require('./get_company_test');

class GetMyCompanyTest extends GetCompanyTest {

	get description () {
		return 'should return a valid company when requesting a company created by me';
	}

	// set the path for the request to test
	setPath (callback) {
		// requesting the company i created
		this.path = '/companies/' + this.myCompany._id;
		callback();
	}

	// validate that we got the right company
	validateResponse (data) {
		this.validateMatchingObject(this.myCompany._id, data.company, 'company');
		super.validateResponse(data);
	}
}

module.exports = GetMyCompanyTest;