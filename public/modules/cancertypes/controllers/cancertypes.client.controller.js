'use strict';

// Cancertypes controller
angular.module('cancertypes').controller('CancertypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cancertypes',
	function($scope, $stateParams, $location, Authentication, Cancertypes ) {
		$scope.authentication = Authentication;

		// Create new Cancertype
		$scope.create = function() {
			// Create new Cancertype object
			var cancertype = new Cancertypes ({
				name: this.name
			});

			// Redirect after save
			cancertype.$save(function(response) {
				$location.path('cancertypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cancertype
		$scope.remove = function( cancertype ) {
			if ( cancertype ) { cancertype.$remove();

				for (var i in $scope.cancertypes ) {
					if ($scope.cancertypes [i] === cancertype ) {
						$scope.cancertypes.splice(i, 1);
					}
				}
			} else {
				$scope.cancertype.$remove(function() {
					$location.path('cancertypes');
				});
			}
		};

		// Update existing Cancertype
		$scope.update = function() {
			var cancertype = $scope.cancertype ;

			cancertype.$update(function() {
				$location.path('cancertypes/' + cancertype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cancertypes
		$scope.find = function() {
			$scope.cancertypes = Cancertypes.query();
		};

		// Find existing Cancertype
		$scope.findOne = function() {
			$scope.cancertype = Cancertypes.get({ 
				cancertypeId: $stateParams.cancertypeId
			});
		};

		$scope.trial = function(trialId) {
			$location.open('#!/trials/' + trialId);
		};
	}
]);