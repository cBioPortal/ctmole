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
			$scope.genes = Genes.gene.query();
		};

		// Find existing Gene
		$scope.findOne = function() {
<<<<<<< HEAD
			$scope.gene = Genes.gene.get({ 
=======
			$scope.gene = Genes.gene.get({
>>>>>>> origin/ctmoleBranch
				symbol: $stateParams.symbol
			});
		};
	}
]);
