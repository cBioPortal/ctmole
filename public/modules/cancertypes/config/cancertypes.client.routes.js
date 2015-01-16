'use strict';

//Setting up route
angular.module('cancertypes').config(['$stateProvider',
	function($stateProvider) {
		// Cancertypes state routing
		$stateProvider.
		state('listCancertypes', {
			url: '/cancertypes',
			templateUrl: 'modules/cancertypes/views/list-cancertypes.client.view.html'
		}).
		state('createCancertype', {
			url: '/cancertypes/create',
			templateUrl: 'modules/cancertypes/views/create-cancertype.client.view.html'
		}).
		state('viewCancertype', {
			url: '/cancertypes/:cancertypeId',
			templateUrl: 'modules/cancertypes/views/view-cancertype.client.view.html'
		}).
		state('editCancertype', {
			url: '/cancertypes/:cancertypeId/edit',
			templateUrl: 'modules/cancertypes/views/edit-cancertype.client.view.html'
		});
	}
]);