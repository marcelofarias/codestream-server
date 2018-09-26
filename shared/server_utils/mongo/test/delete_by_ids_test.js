'use strict';

const MongoTest = require('./mongo_test');

class DeleteByIdsTest extends MongoTest {

	get description () {
		return 'should not get documents after they have been deleted by ID';
	}

	async before (callback) {
		try {
			await super.before();					// set up mongo client
			await this.createRandomDocuments();	// create a set of random documents
			await this.filterTestDocuments();		// filter down to the documents we will NOT delete
			await this.deleteDocuments();			// delete some of the documents
		}
		catch (error) {
			return callback(error);
		}
		callback();
	}

	// delete a subset of our test documents
	async deleteDocuments () {
		// delete only the documents we DON'T want to be returned
		const toDelete = this.documents.filter(document => {
			return !this.wantN(document.number);
		});
		const ids = toDelete.map(document => { return document._id; });
		await this.data.test.deleteByIds(ids);
	}

	// run the test...
	async run (callback) {
		// fetch all the test documents, but we should only get back the ones we didn't delete
		const ids = this.documents.map(document => { return document._id; });
		let response;
		try {
			response = await this.data.test.getByIds(ids);
		}
		catch (error) {
			this.checkResponse(error, response, callback);
		}
		this.checkResponse(null, response, callback);
	}

	validateResponse () {
		this.validateArrayResponse();
	}
}

module.exports = DeleteByIdsTest;
