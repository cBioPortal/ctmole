'use strict';

// Alterations controller
angular.module('alterations').controller('AlterationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Alterations',
	function($scope, $stateParams, $location, Authentication, Alterations ) {
		$scope.authentication = Authentication;

		// Create new Alteration
		$scope.create = function() {
			// Create new Alteration object
			var alteration = new Alterations ({
				name: this.name
			});

			// Redirect after save
			alteration.$save(function(response) {
				$location.path('alterations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Alteration
		$scope.remove = function( alteration ) {
			if ( alteration ) { alteration.$remove();

				for (var i in $scope.alterations ) {
					if ($scope.alterations [i] === alteration ) {
						$scope.alterations.splice(i, 1);
					}
				}
			} else {
				$scope.alteration.$remove(function() {
					$location.path('alterations');
				});
			}
		};

		// Update existing Alteration
		$scope.update = function() {
			var alteration = $scope.alteration ;

			alteration.$update(function() {
				$location.path('alterations/' + alteration._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Alterations
		$scope.find = function() {
			$scope.alterations = Alterations.query();
		};

		// Find existing Alteration
		$scope.findOne = function() {
			$scope.alteration = Alterations.get({ 
				alterationId: $stateParams.alterationId
			});
		};
	}
]);