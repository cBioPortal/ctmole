'use strict';

//Mappings service used to communicate Mappings REST endpoints
angular.module('mappings').factory('Mappings', ['$resource',
	function($resource) {
		return $resource('mappings/:mappingId', { mappingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);