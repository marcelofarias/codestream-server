'use strict';

var APIServerModule = require(process.env.CS_API_TOP + '/lib/api_server/api_server_module.js');

const DEPENDENCIES = [
	'request_id'
];

class RequestTracker extends APIServerModule {

	constructor (config) {
		super(config);
		this.trackedRequests = {};
	}

	getDependencies () {
		return DEPENDENCIES;
	}

	services () {
		return (callback) => {
			return callback(null, [{ requestTracker: this }]);
		};
	}

	middlewares () {
		return (request, response, next) => {
			this.trackRequest(request);
			response.on('finish', () => {
				this.maybeUntrackRequest(request);
			});
			response.on('close', () => {
				this.maybeUntrackRequest(request);
			});
			response.on('complete', () => {
				this.untrackRequest(request);
			});
			process.nextTick(next);
		};
	}

	trackRequest (request) {
		this.trackedRequests[request.id] = request;
	}

	maybeUntrackRequest (request) {
		if (!request.keepOpen) {
			this.untrackRequest(request);
		}
	}

	untrackRequest (request) {
		delete this.trackedRequests[request.id];
		if (this.numOpenRequests() === 0) {
			this.api.noMoreRequests();
		}
	}

	numOpenRequests () {
		return Object.keys(this.trackedRequests).length;
	}
}

module.exports = RequestTracker;