'use strict';

//Setting up route
angular.module('trials').config(['$stateProvider',
	function($stateProvider) {
		// Trials state routing
		$stateProvider.
		state('listTrials', {
			url: '/trials',
			templateUrl: 'modules/trials/views/list-trials.client.view.html'
		}).
		state('createTrial', {
			url: '/trials/create',
			templateUrl: 'modules/trials/views/create-trial.client.view.html'
		}).
		state('searchTrial', {
			url: '/trials/search',
			templateUrl: 'modules/trials/views/search-trial.client.view.html'
		}).
		state('viewTrial', {
			url: '/trials/:nctId',
			templateUrl: 'modules/trials/views/view-trial.client.view.html'
		}).
		state('editTrial', {
			url: '/trials/:nctId/edit',
			templateUrl: 'modules/trials/views/edit-trial.client.view.html'
		});
	}
]);