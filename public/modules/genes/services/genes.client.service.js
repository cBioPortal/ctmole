'use strict';

//Genes service used to communicate Genes REST endpoints
angular.module('genes').factory('Genes', ['$resource',
	function($resource) {
		return {
            gene: $resource('genes/:geneId', { geneId: '@_id'
    		}, {
    			update: {
    				method: 'PUT'
    			},
                query: {isArray: true}
    		}),
            nctIds: $resource('genes/trials/:nctIds', {nctIds: []}, {get: {isArray: true}})
        };
	}
]);