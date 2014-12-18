'use strict';

angular.module('trials').factory('Genes', [
	function($resource) {
		return  {
			symbol: $resource('genes/:symbol', { symbol: '@_id'})
		};
	}
]);