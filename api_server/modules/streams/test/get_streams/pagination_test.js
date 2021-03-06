'use strict';

const GetStreamsTest = require('./get_streams_test');
const BoundAsync = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/bound_async');
const Assert = require('assert');

class PaginationTest extends GetStreamsTest {

	constructor (options) {
		super(options);
		this.dontDoForeign = true;
		this.dontDoFileStreams = true;
		this.dontDoDirectStreams = true;
		this.streamCreateThrottle = this.mockMode ? 0 : 100;	// slow things down, pubnub gets overwhelmed
	}

	get description () {
		const order = this.ascending ? 'ascending' : 'descending';
		const type = this.defaultPagination ? 'default' : 'custom';
		let description = `should return the correct streams in correct ${order} order when requesting streams in ${type} pages`;
		if (this.tryOverLimit) {
			description += ', and should limit page size to the maximum allowed';
		}
		return description;
	}

	// override readConfig because immediately after we read the config file, but before we do setup for the test,
	// we need to set some values that are dependent upon the config
	readConfig (callback) {
		super.readConfig(error => {
			if (error) { return callback(error); }

			// set up additional pagination options
			this.numStreams = this.defaultPagination ? Math.floor(this.apiConfig.limits.maxStreamsPerRequest * 2.5) : 17;
			this.streamsPerPage = this.defaultPagination ? this.apiConfig.limits.maxStreamsPerRequest : 5;
			callback();
		});
	}

	// set the path to use when issuing the test request
	setPath (callback) {
		callback(); // no-op, set path later
	}

	// run the actual test, overriding the base class 
	run (callback) {
		// make sure our expected streams our sorted, since they will come back to us (and are paginated)
		// in sorted order
		this.expectedStreams = this.streamsByTeam[this.team.id].filter(stream => {
			return stream.memberIds.includes(this.currentUser.user.id);
		});
		this.expectedStreams.push(this.teamStream);
		this.expectedStreams.sort((a, b) => {
			return a.id.localeCompare(b.id);
		});
		// divide into pages
		this.numPages = Math.floor(this.numStreams / this.streamsPerPage);
		if (this.numStreams % this.streamsPerPage !== 0) {
			this.numPages++;
		}
		this.allStreams = this.expectedStreams;
		if (!this.ascending) {	// reverse order for "asc" sort option
			this.allStreams.reverse();
		}

		// now fetch pages in turn
		BoundAsync.timesSeries(
			this,
			this.numPages,
			this.fetchPage,
			callback
		);
	}

	// fetch a single page of streams and validate the response
	fetchPage (pageNum, callback) {
		this.path = `/streams?teamId=${this.team.id}`;
		if (this.tryOverLimit) {
			// we'll try to fetch more than the server's limit, we should still get back
			// the maximum number of streams allowed in a page
			const limit = this.apiConfig.limits.maxStreamsPerRequest * 2;
			this.path += `&limit=${limit}`;
		}
		else if (!this.defaultPagination) {
			// we'll fetch back a smaller number of streams per page
			this.path += `&limit=${this.streamsPerPage}`;
		}
		if (this.ascending) {
			// we'll fetch in ascending order, rather than descending which is the default
			this.path += '&sort=asc';
		}
		if (pageNum > 0) {
			// after the first page, use the last ID we fetched to fetch the next page
			const op = this.ascending ? 'gt' : 'lt';
			this.path += `&${op}=${this.lastId}`;
		}
		this.doApiRequest(
			{
				method: this.method,
				path: this.path,
				token: this.token
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.validatePageResponse(pageNum, response);
				callback();
			}
		);
	}

	// validate that we got back the expected page of streams
	validatePageResponse (pageNum, response) {
		Assert(typeof response === 'object', `response to page ${pageNum} fetch is not an object`);
		Assert(response.streams instanceof Array, `response.streams for ${pageNum} fetch is not an array`);
		if (pageNum + 1 < this.numPages) {	// more flag should be set except for the last page
			Assert(response.more === true, `more expected for page ${pageNum}`);
		}
		else {
			Assert(!response.more, 'more flag set for last page');
		}
		const begin = pageNum * this.streamsPerPage;
		const end = begin + this.streamsPerPage;

		// prepare the expected streams to be the given page, and call the base class validation
		this.expectedStreams = this.allStreams.slice(begin, end);	
		this.validateResponse(response);

		// record the last ID, we'll fetch the next page using this ID as our page divider
		this.lastId = this.expectedStreams[this.expectedStreams.length - 1].sortId;
	}
}

module.exports = PaginationTest;
