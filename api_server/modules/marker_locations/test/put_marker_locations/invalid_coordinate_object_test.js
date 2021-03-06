'use strict';

const PutMarkerLocationsTest = require('./put_marker_locations_test');

class InvalidCoordinateObjectTest extends PutMarkerLocationsTest {

	get description () {
		return 'should return error when attempting to put marker locations with a fifth location coordinate that is not an object';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
			info: 'fifth element of location must be an object'
		};
	}

	// set the data to be used in the PUT request
	setData (callback) {
		super.setData(() => {
			const markerId = Object.keys(this.data.locations)[0];
			this.data.locations[markerId][4] = 1;	// the fifth element must be an object!
			callback();
		});
	}
}

module.exports = InvalidCoordinateObjectTest;
