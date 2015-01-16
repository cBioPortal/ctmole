'use strict';

//Setting up route
angular.module('mappings').config(['$stateProvider',
	function($stateProvider) {
		// Mappings state routing
		$stateProvider.
		state('mapping', {
			url: '/mappings',
			controller: 'MappingsController',
			templateUrl: 'modules/mappings/views/search-mappings.client.view.html'
		});
	}
]);