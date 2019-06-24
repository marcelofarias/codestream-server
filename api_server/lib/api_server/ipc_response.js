'use strict';

const EventEmitter = require('events');

class IPCResponse extends EventEmitter {

	constructor (options) {
		super(options);
		Object.assign(this, options);
		this.statusCode = 200;
		this.headers = {};
	}

	status (status) {
		this.statusCode = status;
		return this;
	}

	sendStatus (status) {
		this.statusCode = status;
		if (status === 200) {
			this.send('OK');
		}
		else if (status === 403) {
			this.send('Forbidden');
		}
		else if (status === '404') {
			this.send('Not Found');
		}
		else {
			this.send('Internal Server Error');
		}
	}

	set (header, value) {
		if (typeof header === 'object') {
			Object.assign(this.headers, header);
		}
		else {
			this.headers[header] = value;
		}
		return this;
	}

	type (type) {
		this.set('Content-Type', type);
		return this;
	}

	send (data) {
		const message = {
			statusCode: this.statusCode,
			data,
			headers: this.headers,
			clientRequestId: this.clientRequestId
		};
		this.contentLength = JSON.stringify(message).length;
		this.ipc.emit(this.socket, 'response', message);
		this.emit('finish');
		return this;
	}

	get (what) {
		if (what === 'content-length') {
			return this.contentLength;
		}
	}

	redirect (url) {
		this.set('location', url);
		this.statusCode = 301;
		this.send();
		return this;
	}
}

module.exports = IPCResponse;