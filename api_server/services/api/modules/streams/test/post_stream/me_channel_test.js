'use strict';

var Post_Channel_Stream_Test = require('./post_channel_stream_test');

class Me_Channel_Test extends Post_Channel_Stream_Test {

	get description () {
		return 'should return a valid channel stream with the user as the only member when creating a channel stream with no member ids specified';
	}

	before (callback) {
		super.before(error => {
			if (error) { return callback(error); }
			delete this.data.member_ids;
			callback();
		});
	}

	validate_response (data) {
		this.data.member_ids = []; // current user will be pushed
		super.validate_response(data);
	}
}

module.exports = Me_Channel_Test;