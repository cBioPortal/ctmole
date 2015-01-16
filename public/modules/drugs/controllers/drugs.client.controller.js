'use strict';

// Drugs controller
angular.module('drugs').controller('DrugsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Drugs',
	function($scope, $stateParams, $location, Authentication, Drugs ) {
		$scope.authentication = Authentication;

		// Create new Drug
		$scope.create = function() {
			// Create new Drug object
			var drug = new Drugs ({
				name: this.name
			});

			// Redirect after save
			drug.$save(function(response) {
				$location.path('drugs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Drug
		$scope.remove = function( drug ) {
			if ( drug ) { drug.$remove();

				for (var i in $scope.drugs ) {
					if ($scope.drugs [i] === drug ) {
						$scope.drugs.splice(i, 1);
					}
				}
			} else {
				$scope.drug.$remove(function() {
					$location.path('drugs');
				});
			}
		};

		// Update existing Drug
		$scope.update = function() {
			var drug = $scope.drug ;

			drug.$update(function() {
				$location.path('drugs/' + drug._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Drugs
		$scope.find = function() {
			$scope.drugs = Drugs.regular.query();
		};

		// Find existing Drug
		$scope.findOne = function() {
			$scope.drug = Drugs.regular.get({ 
				drugId: $stateParams.drugId
			});
		};
	}
]);