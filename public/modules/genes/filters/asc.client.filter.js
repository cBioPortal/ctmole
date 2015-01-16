'use strict';

angular.module('genes').filter('asc', [
	function() {
		return function(input) {
			// Asc directive logic
			// ...

			return 'asc filter: ' + input;
		};
	}
]);