'use strict';

var PutTeamTest = require('./put_team_test');
var Assert = require('assert');

class NoUpdateOtherAttributeTest extends PutTeamTest {

	get description () {
		return `should not update ${this.attribute} even if sent in the request`;
	}

	// form the data for the team update
	makePostData (callback) {
		super.makeTeamData(() => {
			this.data[this.attribute] = 'x'; // set bogus value for the attribute, it shouldn't matter
			callback();
		});
	}

	// validate the response to the test request
	validateResponse (data) {
		let team = data.team;
		Assert(team[this.attribute] === undefined, 'attribute appears in the response');
		super.validateResponse(data);
	}
}

module.exports = NoUpdateOtherAttributeTest;