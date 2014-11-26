'use strict';

//Trials service used to communicate Trials REST endpoints
angular.module('trials').factory('Trials', ['$resource',
	function($resource) {
		return $resource('trials/:trialId', { trialId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);