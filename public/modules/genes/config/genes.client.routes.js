'use strict';

//Setting up route
angular.module('genes').config(['$stateProvider',
	function($stateProvider) {
		// Genes state routing
		$stateProvider.
		state('listGenes', {
			url: '/genes',
			templateUrl: 'modules/genes/views/list-genes.client.view.html'
		}).
		state('createGene', {
			url: '/genes/create',
			templateUrl: 'modules/genes/views/create-gene.client.view.html'
		}).
		state('viewGene', {
			url: '/genes/:geneId',
			templateUrl: 'modules/genes/views/view-gene.client.view.html'
		}).
		state('editGene', {
			url: '/genes/:geneId/edit',
			templateUrl: 'modules/genes/views/edit-gene.client.view.html'
		});
	}
]);