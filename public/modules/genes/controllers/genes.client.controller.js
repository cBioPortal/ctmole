'use strict';

// Genes controller
angular.module('genes').controller('GenesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Genes',
	function($scope, $stateParams, $location, Authentication, Genes ) {
		$scope.authentication = Authentication;

		// Create new Gene
		$scope.create = function() {
			// Create new Gene object
			var gene = new Genes ({
				name: this.name
			});

			// Redirect after save
			gene.$save(function(response) {
				$location.path('genes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gene
		$scope.remove = function( gene ) {
			if ( gene ) { gene.$remove();

				for (var i in $scope.genes ) {
					if ($scope.genes [i] === gene ) {
						$scope.genes.splice(i, 1);
					}
				}
			} else {
				$scope.gene.$remove(function() {
					$location.path('genes');
				});
			}
		};

		// Update existing Gene
		$scope.update = function() {
			var gene = $scope.gene ;

			gene.$update(function() {
				$location.path('genes/' + gene._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Genes
		$scope.find = function() {
			$scope.genes = Genes.query();
		};

		// Find existing Gene
		$scope.findOne = function() {
			$scope.gene = Genes.get({ 
				geneId: $stateParams.geneId
			});
		};
	}
]);