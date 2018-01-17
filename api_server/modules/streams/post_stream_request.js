'use strict';

var PostRequest = require(process.env.CS_API_TOP + '/lib/util/restful/post_request');
var StreamPublisher = require('./stream_publisher');

class PostStreamRequest extends PostRequest {

	authorize (callback) {
		this.user.authorizeFromTeamId(this.request.body, this, callback, { error: 'createAuth' });
	}

	postProcess (callback) {
		new StreamPublisher({
			data: this.responseData,
			stream: this.responseData.stream,
			request: this,
			messager: this.api.services.messager
		}).publishStream(callback);
	}
}

module.exports = PostStreamRequest;