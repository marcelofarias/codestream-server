'use strict';

var LoginTest = require('./login_test');

class NoAttributeTest extends LoginTest {

	get description () {
		return `should return error when no ${this.attribute} provided`;
	}

	getExpectedFields () {
		return null;
	}

	getExpectedError () {
		return {
			code: 'RAPI-1001',
			info: this.attribute
		};
	}

	before (callback) {
		super.before(() => {
			delete this.data[this.attribute];
			callback();
		});
	}
}

module.exports = NoAttributeTest;