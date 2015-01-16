'use strict';

//Alterations service used to communicate Alterations REST endpoints
angular.module('alterations').factory('Alterations', ['$resource',
	function($resource) {
		return $resource('alterations/:alterationId', { alterationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);