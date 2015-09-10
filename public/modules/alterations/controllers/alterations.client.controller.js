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
			$scope.alterations = Alterations.alteration.query();
		};

		// Find existing Alteration
		$scope.findOne = function() {
			$scope.alteration = Alterations.alteration.get({
				alterationSymbol: $stateParams.alterationSymbol
			});
		};
	}
]);
