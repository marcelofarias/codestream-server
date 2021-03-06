'use strict';

const UpdateToCacheTest = require('./update_to_cache_test');

class ApplySetSubObjectToCacheTest extends UpdateToCacheTest {

	get description () {
		return 'should get the correct model after applying a sub-object set to a cached model';
	}

	async updateTestModel () {
		// selectively set some values in the object, and verify they are set
		const set = {
			'object.x': 'replaced!',
			'object.z': 3
		};
		this.expectedOp = {
			'$set': set
		};

		this.actualOp = await this.data.test.applyOpById(
			this.testModel.id,
			this.expectedOp
		);
		Object.assign(this.testModel.attributes.object, { x: 'replaced!', z: 3 });
	}
}

module.exports = ApplySetSubObjectToCacheTest;
