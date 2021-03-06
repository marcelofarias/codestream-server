// handle the "PUT /unread/:postId" request to mark a post (and all subsequent posts) 
// as unread in a particular stream

'use strict';

const RestfulRequest = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/util/restful/restful_request.js');
const ModelSaver = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/util/restful/model_saver');

class UnreadRequest extends RestfulRequest {

	// authorize the request before processing....
	async authorize () {
		// they must have read access to the post, meaning it's in a stream they have access to
		const postId = this.request.params.postId.toLowerCase();
		this.post = await this.user.authorizePost(postId, this);
		if (!this.post) {
			throw this.errorHandler.error('updateAuth', { reason: 'user does not have access to post' });
		}
	}

	// process the request...
	async process () {
		// set the lastReads value for the post's stream, to the sequence number PRIOR to
		// the sequence number for this post
		const streamId = this.post.get('streamId');
		const seqNum = this.post.get('seqNum') - 1;
		const op = {
			$set: {
				['lastReads.' + streamId]: seqNum,
				modifiedAt: Date.now()
			}
		};
		this.updateOp = await new ModelSaver({
			request: this,
			collection: this.data.users,
			id: this.user.id
		}).save(op);
	}

	async handleResponse () {
		if (this.gotError) {
			return await super.handleResponse();
		}
		this.responseData = { user: this.updateOp };
		super.handleResponse();
	}

	// after the response is returned....
	async postProcess () {
		// send the lastReads update on the user's me-channel, so other active
		// sessions get the message
		const channel = 'user-' + this.user.id;
		const message = Object.assign({}, this.responseData, { requestId: this.request.id });
		try {
			await this.api.services.broadcaster.publish(
				message,
				channel,
				{ request: this	}
			);
		}
		catch (error) {
			// this doesn't break the chain, but it is unfortunate
			this.warn(`Unable to publish lastReads message to channel ${channel}: ${JSON.stringify(error)}`);
		}
	}

	// describe this route for help
	static describe () {
		return {
			tag: 'unread',
			summary: 'Mark the unread point for a stream',
			access: 'User must have read access to the given post, meaning they have access to the stream it\'s in',
			description: 'Mark the unread point for a stream to the given post, all posts going forward from this one are assumed to be unread',
			input: 'Specify ID of the post in the path',
			returns: 'Empty object',
			publishes: {
				summary: 'Publishes a user object, with directives, to the user\'s user channel, indicating how the lastReads attribute for the user object should be updated',
				looksLike: {
					user: {
						id: '<ID of the user>',
						$set: {
							lastReads: {
								['<streamId of the post>']: '<sequence number of the previous post>'
							}
						}
					}
				}
			},
			errors: [
				'notFound',
				'updateAuth'
			]
		};
	}
}

module.exports = UnreadRequest;
