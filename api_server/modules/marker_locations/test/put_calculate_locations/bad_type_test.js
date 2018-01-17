'use strict';

var PutCalculateLocationsTest = require('./put_calculate_locations_test');

class BadTypeTest extends PutCalculateLocationsTest {

	get description () {
		return `should return error when attempting to calculate marker locations with a bad type for ${this.attribute}`;
	}

	getExpectedError () {
		return {
			code: 'RAPI-1012',
			info: this.attribute
		};
	}

	// set the data to be used in the PUT request
	setData (callback) {
		super.setData(() => {
			this.data[this.attribute] = 1; // replace the value of this.attribute with nonsense
			callback();
		});
	}
}

module.exports = BadTypeTest;