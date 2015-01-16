'use strict';

//Drugs service used to communicate Drugs REST endpoints
angular.module('drugs').factory('Drugs', ['$resource',
	function($resource) {
		return {
			full: $resource('drugs/full', {}, {
					update: {
						method: 'PUT'
					}
				}),
			regular: $resource('drugs/:drugId', { drugId: '@_id'
				}, {
					update: {
						method: 'PUT'
					}
				})
		};
		
	}
]);