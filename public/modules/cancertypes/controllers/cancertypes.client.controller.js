/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of CT-MOLE.
 *
 * CT-MOLE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
				$location.path('cancertypes/' + cancertype.symbol);
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
			$scope.cancertype = Cancertypes.cancertype.get({
				cancertypeSymbol: $stateParams.cancertypeSymbol
			});
		};

		$scope.trial = function(trialId) {
			$location.open('#!/trials/' + trialId);
		};
	}
]);

