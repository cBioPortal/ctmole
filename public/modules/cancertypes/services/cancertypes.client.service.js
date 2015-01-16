'use strict';

//Cancertypes service used to communicate Cancertypes REST endpoints
angular.module('cancertypes').factory('Cancertypes', ['$resource',
	function($resource) {
		return $resource('cancertypes/:cancertypeId', { cancertypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);