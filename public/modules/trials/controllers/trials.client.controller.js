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

// Trials controller
angular.module('trials').controller('TrialsController', 
	['$scope', 
	'$stateParams', 
	'$location', 
	'Authentication', 
	'Trials',
	'Genes',
	'Alterations',
	'Cancertypes',
	'Drugs',
	function($scope, $stateParams, $location, Authentication, Trials, Genes, Alterations, Cancertypes, Drugs) {
		$scope.authentication = Authentication;
		$scope.nctId = '';
        $scope.drugHeader = ["Drug Name","Synonyms","FDA Approved","ATC Codes","Description"];
        $scope.drugItems = ["drugName","synonyms","fdaApproved","atcCodes","description"];
        $scope.tumorHeader = ["Name","Tissue","Clinical TrialKeywords"];
        $scope.tumorItems = ["name","tissue","clinicalTrialKeywords"];
        $scope.overviewHeader = ["alterations","disease Condition","last Changed Date","nct Id","phase","recruiting Status"];
        $scope.overviewItems = ["alterations","diseaseCondition","lastChangedDate","nctId","phase","recruitingStatus"];

		function syntaxHighlight(json) {
			json = JSON.stringify(json, undefined, 4);
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return '<span class="' + cls + '">' + match + '</span>';
		    });
		}

		$scope.beautify = syntaxHighlight;
		// Create new Trial
		$scope.create = function() {
			// Create new Trial object
			var trial = new Trials ({
				nctId: this.name
			});

			// Redirect after save
			trial.$save(function(response) {
				$location.path('trials/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trial
		$scope.remove = function( trial ) {
			if ( trial ) { trial.$remove();

				for (var i in $scope.trials ) {
					if ($scope.trials [i] === trial ) {
						$scope.trials.splice(i, 1);
					}
				}
			} else {
				$scope.trial.$remove(function() {
					$location.path('trials');
				});
			}
		};

		// Update existing Trial
		$scope.update = function() {
			var trial = $scope.trial ;

			trial.$update(function() {
				$location.path('trials/' + trial.nctId);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trials
		$scope.find = function() {
			$scope.trials = Trials.nctId.query();
		};

		// Find existing Trial
		$scope.findOne = function() {
			$scope.trial = Trials.nctId.get({ 
				nctId: $stateParams.nctId
			});

			//Analysis trial
		};

		$scope.searchByKeyword = function() {
			$scope.trials = Trials.keyword.query({
				keyword: $scope.keyword
			});
			console.log($scope.trials);
		};

		$scope.searchTrailBynctId = function() {
			$location.path('trials/' + $scope.nctId);
		};

		$scope.assignTrailBynctId = function() {
			$scope.trial = Trials.nctId.get({ 
				nctId: $scope.nctId
			});
			$scope.trialGenes = Genes.nctIds.get({ 
				nctIds: [$scope.nctId]
			});
			console.log($scope.trialGenes);
		};

		$scope.getDrugs = function(drugs) {
			return drugs.map(function(e){return e.drugName;}).join(', ');
		};

		$scope.getEligibility = function(eligibility, elgType){
			var m = eligibility.indexOf("Inclusion Criteria") + 30;
			var n = eligibility.indexOf("Exclusion Criteria") + 30;
			var inEligi = eligibility.substr(m,n-m);
			var exEligi = eligibility.substr(n);
			if(elgType == "exclusion")
				return exEligi;
			else if(elgType == "inclusion")
				return inEligi;

		};
	}
]);