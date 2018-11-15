// base class for many tests of the "DELETE /codemarks/:id" requests

'use strict';

const BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const DeepClone = require(process.env.CS_API_TOP + '/server_utils/deep_clone');
const CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
const RandomString = require('randomstring');

class CommonInit {

	init (callback) {
		this.testPost = 0;
		this.expectedVersion = 2;
		BoundAsync.series(this, [
			this.setTestOptions,
			CodeStreamAPITest.prototype.before.bind(this),
			this.makePostlessCodemark,
			this.setExpectedData,
			this.setPath
		], callback);
	}

	setTestOptions (callback) {
		this.teamOptions.creatorIndex = 1;
		callback();
	}

	// make a postless codemark, as needed for the test
	makePostlessCodemark (callback) {
		if (this.wantPost) {
			// only need to make a postless codemark if we're not creating it
			// by creating a post
			this.codemark = this.postData[this.testPost].codemark;
			this.markers = this.postData[this.testPost].markers;
			return callback();
		}
		const codemarkData = this.getPostlessCodemarkData();
		const token = this.codemarkCreator ?
			this.users[this.codemarkCreator].accessToken :
			this.currentUser.accessToken;
		this.doApiRequest(
			{
				method: 'post',
				path: '/codemarks',
				data: codemarkData,
				token
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.codemark = response.codemark;
				this.markers = response.markers;
				callback();
			}
		);
	}

	// get data to use for the postless codemark, as needed
	getPostlessCodemarkData () {
		const data = this.codemarkFactory.getRandomCodemarkData();
		Object.assign(data, {
			teamId: this.team._id,
			providerType: RandomString.generate(8)
		});
		if (this.wantMarker) {
			data.markers = [this.markerFactory.getRandomMarkerData()];
		}
		return data;
	}

	setExpectedData (callback) {
		this.expectedData = {
			codemarks: [{
				_id: this.codemark._id,
				$set: {
					version: this.expectedVersion,
					deactivated: true,
					modifiedAt: Date.now() // placehodler
				},
				$version: {
					before: this.expectedVersion - 1,
					after: this.expectedVersion
				}
			}]
		};
		this.expectedCodemark = DeepClone(this.codemark);
		Object.assign(this.expectedCodemark, this.expectedData.codemarks[0].$set);
		this.modifiedAfter = Date.now();
		callback();
	}

	setPath (callback) {
		this.path = '/codemarks/' + this.codemark._id;
		callback();
	}

	deleteCodemark (callback) {
		this.doApiRequest(
			{
				method: 'delete',
				path: '/codemarks/' + this.codemark._id,
				data: null,
				token: this.token
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.message = response;
				callback();
			}
		);
	}
}

module.exports = CommonInit;