'use strict';

var InboundEmailTest = require('./inbound_email_test');
var ObjectID = require('mongodb').ObjectID;

class StreamNotFoundTest extends InboundEmailTest {

	get description () {
		return 'should return an error when trying to send an inbound email request with a to address that has a streamID for a stream that does not exist';
	}

	getExpectedError () {
		return {
			code: 'INBE-1005',
		};
	}

	// make the data to be used in the request that triggers the message
	makePostData (callback) {
		super.makePostData(() => {
			// inject a valid but non-existent stream ID
			let index = this.data.to[0].address.indexOf('.');
			let fakeStreamId = ObjectID();
			this.data.to[0].address = fakeStreamId + this.data.to[0].address.slice(index);
			this.data.to.splice(1);
			callback();
		});
	}
}

module.exports = StreamNotFoundTest;
