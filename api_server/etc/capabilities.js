'use strict';

module.exports = {
	'sample': {
		description: 'SAMPLE',
		version: '1.0.0'
	},
	'multipleMarkers': {
		description: 'Ability to have multiple code blocks per codemark',
		version: '1.21.20'
	},
	'moveMarkers': {
		description: 'Ability to change the location of code blocks pointed to by codemarks',
		version: '1.21.20'
	},
	'moveMarkers2': {
		description: 'Ability to change the location of code blocks pointed to by codemarks, with essential API server fix',
		version: '1.21.23'
	},
	'repoCommitMatching': {
		description: 'Supports the /repos/match/:teamId call, which allows matches to be found for repos by remotes and known commit hashes',
		version: '1.21.24'
	},
	'follow': {
		description: 'Ability to follow or unfollow a codemark',
		version: '1.21.27'
	},
	'lightningCodeReviews': {
		description: 'Support for lightning code reviews',
		version: '1.21.33',
		supportedIdes: ['VS Code', 'JetBrains']
	},
	'xray': {
		description: 'Support for feature x-ray, to monitor what co-workers are actively working on',
		version: '1.21.33',
		restricted: true
	},
	'notificationDeliveryPreference': {
		description: 'Support for displaying the email/desktop delivery notification preference',
		version: '1.21.33'
	},
	'multipleReviewersApprove': {
		description: 'Support for multiple reviewers being required to approve a review',
		version: '7.1.1'
	},
	'emailSupport': {
		description: 'Whether outbound emails are supported, value actually comes from configuration',
		version: '1.0.0'
	},
	'multiCheckpointReviews': {
		description: 'Reviews supporting multiple checkpoints',
		version: '7.2.0'
	},
	'inviteUsersOnTheFly': {
		description: 'Users can be invited on-the-fly in codemarks and reviews',
		version: '7.2.7'
	},
	'kickstart': {
		description: 'Kickstart features',
		version: '7.4.2'
	},
	'cr2pr': {
		description: 'Features supporting opening pull requests after code reviews',
		version: '7.4.2'
	}
};
