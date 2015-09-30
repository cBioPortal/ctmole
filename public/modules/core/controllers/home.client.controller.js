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


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Trials',
	function($scope, Authentication, Trials) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.loading = false;
		$scope.showResult = false;
		$scope.showRefine = false;

		$scope.countries = ['China', 'United Kingdom', 'Portugal', 'Spain', 'Italy', 'Sweden'];
		$scope.genes = ['BRAF', 'PSMB5', 'MEK1', 'KRAS', 'IL2', 'EGFR'];
		$scope.mutations = ['BRAF V600', 'BRAF V600E', 'BRAF V600K', 'HER-2 Loss', 'HER-2 Amplification'];


		$scope.criteria = [{type: 'country', value: 'United States'}];
		$scope.types = ['country'];

		$scope.search = function(searchKeyword) {
			if(searchKeyword === undefined)
			{
				bootbox.alert('please input keyword to start search!');
				return false;
			}
			$scope.loading = true;
			$scope.showResult = false;
			$scope.criteria = [{type: 'country', value: 'United States'}];
			$scope.types = ['country'];
			$scope.trials = Trials.searchEngine.query({searchEngineKeyword: searchKeyword}, function (data) {
				$scope.loading = false;
				$scope.showResult = true;
				$scope.showRefine = true;

			});

			var inputs = document.getElementsByTagName("input");
			for(var i = 0; i < inputs.length; i++) {
				if(inputs[i].type == "checkbox") {
					inputs[i].checked = false;
				}
			}
			document.getElementById('US').checked = true;
			document.getElementById(searchKeyword.toUpperCase()).checked = true;


			$scope.criteria.push({type: 'gene', value: 'BRAF'});
			$scope.types.push('gene');


		};

		$scope.searchCriteria = function() {
			return function(trial) {

				var tempStr = JSON.stringify(trial);
				var finalFlag = true;
				var flags = [];
				var index;
				var types = _.uniq($scope.types);
				for(var i = 0;i < types.length;i++)
				{
					flags.push({type: types[i], value: false});
				}

				for(var i = 0;i < $scope.criteria.length;i++)
				{
					var criterion = $scope.criteria[i];

					if(tempStr.match(criterion.value) != undefined)
					{
						for(var j = 0;j < flags.length;j++)
						{
							if(flags[j].type == criterion.type)
							{
								index = j;
								break;
							}
						}
						flags[index].value = true;
					}
				}
				for(var i = 0;i < flags.length;i++)
				{
					finalFlag = finalFlag && flags[i].value;
				}
				return finalFlag;

			}
		};

		$scope.getCriteria = function(checked, value, type)
		{
			if(checked)
			{
				$scope.criteria.push({type: type, value: value});
				$scope.types.push(type);
			}
			else
			{
				$scope.criteria = _.without($scope.criteria, _.where($scope.criteria, {type: type, value: value})[0] );
				$scope.types.splice($scope.types.indexOf(type), 1);
			}

		};

	}
]);
