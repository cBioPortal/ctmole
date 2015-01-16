'use strict';

//Setting up route
angular.module('alterations').config(['$stateProvider',
	function($stateProvider) {
		// Alterations state routing
		$stateProvider.
		state('listAlterations', {
			url: '/alterations',
			templateUrl: 'modules/alterations/views/list-alterations.client.view.html'
		}).
		state('createAlteration', {
			url: '/alterations/create',
			templateUrl: 'modules/alterations/views/create-alteration.client.view.html'
		}).
		state('viewAlteration', {
			url: '/alterations/:alterationId',
			templateUrl: 'modules/alterations/views/view-alteration.client.view.html'
		}).
		state('editAlteration', {
			url: '/alterations/:alterationId/edit',
			templateUrl: 'modules/alterations/views/edit-alteration.client.view.html'
		});
	}
]);