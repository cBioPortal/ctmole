'use strict';

//Setting up route
angular.module('drugs').config(['$stateProvider',
	function($stateProvider) {
		// Drugs state routing
		$stateProvider.
		state('listDrugs', {
			url: '/drugs',
			templateUrl: 'modules/drugs/views/list-drugs.client.view.html'
		}).
		state('createDrug', {
			url: '/drugs/create',
			templateUrl: 'modules/drugs/views/create-drug.client.view.html'
		}).
		state('viewDrug', {
			url: '/drugs/:drugId',
			templateUrl: 'modules/drugs/views/view-drug.client.view.html'
		}).
		state('editDrug', {
			url: '/drugs/:drugId/edit',
			templateUrl: 'modules/drugs/views/edit-drug.client.view.html'
		});
	}
]);