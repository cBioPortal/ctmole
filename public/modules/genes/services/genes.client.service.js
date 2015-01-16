'use strict';

//Genes service used to communicate Genes REST endpoints
angular.module('genes').factory('Genes', ['$resource',
	function($resource) {
		return $resource('genes/:geneId', { geneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);