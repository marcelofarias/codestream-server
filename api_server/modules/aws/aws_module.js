// provides AWS-related services to the API server,
// the various services are all collected under one roof here

'use strict';

var APIServerModule = require(process.env.CS_API_TOP + '/lib/api_server/api_server_module');
var AWS = require(process.env.CS_API_TOP + '/server_utils/aws/aws');
var SQSClient = require('./sqs_client');

class AWSModule extends APIServerModule {

	services () {
		// return a function that, when invoked, returns a service structure with the desired AWS services
		return (callback) => {
			this.api.log('Initiating AWS services...');
			this.aws = new AWS(this.api.config.aws);
			this.initializeSQS();
			return callback(null, [{
				queueService: this.sqsClient
			}]);
		};
	}

	initializeSQS () {
		this.sqsClient = new SQSClient({ aws: this.aws });
	}
}

module.exports = AWSModule;