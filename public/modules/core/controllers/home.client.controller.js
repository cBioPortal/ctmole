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


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Trials','Mappings','Alterations',
	function($scope, Authentication, Trials, Mappings, Alterations) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.loading = false;
		$scope.showResult = false;
		$scope.showRefine = false;
		$scope.allCountries = false;
		$scope.firstSearch = true;

		$scope.countryCriteria = ['United States'];
		$scope.criteria = [{type: 'country', value: ['United States']}];
		$scope.types = ['country'];
		$scope.geneCriteria = [];
		$scope.mutationCriteria = [];
		$scope.trialsNctIds = [];
		$scope.comTrialIds = [];


		$scope.find = function()
		{
			document.getElementById("USRadio").checked = true;
		}


		function endSearch()
		{
			$scope.loading = false;
			$scope.showResult = true;
			$scope.showRefine = true;
		}

		function autoCreateFilters(data)
		{
			for(var i = 0;i < data.length;i++)
			{
				Mappings.mappingSearch.get({
						Idvalue: data[i].nctId
					},
					function(a)
					{
						var alteration_id = [];
						for(var i = 0;i < a.alteration.length;i++)
						{
							alteration_id.push(a.alteration[i].alteration_Id);
						}
						if(alteration_id.length > 0)
						{
							Alterations.alterationByIds.query({
									Ids: alteration_id
								},
								function(alterations)
								{
									_.map(alterations, function(value){
										if($scope.mutationIDs.indexOf(value._id) == -1)
										{
											$scope.mutationIDs.push(value._id);
											$scope.mutations.push({gene: value.gene, alteration: value.alteration});
											$scope.genes.push(value.gene);
											$scope.genes = _.uniq($scope.genes);
										}
									});

									endSearch();

								}
							);


						}

					},
					function(b)
					{}
				);


			}

		}


		$scope.showAllCountries = function()
		{
			$scope.allCountries = true;
			$scope.criteria = _.without($scope.criteria, _.where($scope.criteria, {type: 'country'}) );
			$scope.criteria = [{type: 'country', value: ['United States']}];

			document.getElementById('US').checked = true;
			var otherCountries = document.getElementsByName("otherCountries");
			for(var i = 0;i < otherCountries.length;i++)
			{
				otherCountries[i].checked = false;
			}
		}
		$scope.hideAllCountries = function()
		{
			$scope.allCountries = false;
			_.each($scope.criteria, function(criterion)
			{
				if(criterion.type == 'country')
				{
					criterion.value = ['United States'];
				}
			});

		}
		$scope.search = function(searchStr) {
			var searchKeyword = $scope.searchKeyword;
			if(searchKeyword === undefined)
			{
				bootbox.alert('please input keyword to start search!');
				return false;
			}

			$scope.loading = true;
			$scope.showResult = false;
			$scope.showRefine = false;

			$scope.countries = [];
			$scope.genes = [];
			$scope.mutations = [];
			$scope.mutationIDs = [];

			//search in the trial table
			Trials.searchEngine.query({searchEngineKeyword: searchKeyword}, function (data) {
				for(var i = 0;i < data.length;i++)
				{
					$scope.countries = $scope.countries.concat(data[i].countries);
					$scope.trialsNctIds.push(data[i].nctId);
				}
				$scope.countries = _.uniq($scope.countries);
				$scope.countries = _.without($scope.countries,"United States" );
				$scope.countries.sort();
				searchMappingByStatus();
				searchInAlteration(searchKeyword);
			});
			//search in the mapping table
			function searchMappingByStatus()
			{

				Mappings.searchByStatus.query({
						status: true
					},
					function (data) {
						if(data.length > 0)
						{
							for(var i = 0;i < data.length;i++)
							{
								$scope.comTrialIds.push(data[i].nctId);
							}

						}
					},
					function(error)
					{
						console.log('No hits in the mapping table');
					}
				);
			}

			function searchInAlteration(searchKeyword)
			{
				//search in the alteration table
				Alterations.searchEngine.query({
						searchEngineKeyword: searchKeyword
					},
					function(alterationData)
					{
						if(alterationData.length > 0)
						{
							var alterationIds = "";
							for(var i = 0;i < alterationData.length;i++)
							{
								alterationIds += alterationData[i]._id + " ";
							}
							if(alterationIds.length > 0)
							{
								Mappings.searchEngine.query({
										searchEngineKeyword: alterationIds
									},

									function (data) {
										if(data.length > 0)
										{
											var nctIds = [];
											for(var i = 0;i < data.length;i++)
											{
												nctIds.push(data[i].nctId);
											}

											$scope.trialsNctIds = $scope.trialsNctIds.concat(nctIds);
											$scope.trialsNctIds = _.uniq($scope.trialsNctIds);

											Trials.nctIds.query({nctIds: $scope.trialsNctIds},
												function(trialData)
												{
													$scope.trials = trialData;
													autoCreateFilters(trialData);

												},
												function(trialDataError)
												{
													console.log('not found data', trialDataError);
												})


										}


									},
									function(error)
									{
										console.log('did not find data', error);
									}
								);
							}
						}

					},
					function(alterationDataError)
					{
						console.log('No hits in the alteration table');
					}
				)
			}

		};

		$scope.searchCriteria = function() {
			return function(trial) {
				var tempStr = JSON.stringify(trial);
				var finalFlag = true;
				var flags = [];

				var types = _.uniq($scope.types);
				for(var i = 0;i < types.length;i++)
				{
					flags.push({type: types[i], value: false});
				}
				_.each($scope.criteria, function(criterion)
				{
					var index = $scope.criteria.map(function(e) { return e.type; }).indexOf(criterion.type);
					if(criterion.type == 'status')
					{
						if(criterion.value == 'all')
						{
							flags[index].value = true;
						}
						else if(criterion.value == 'incomplete')
						{
							if ($scope.comTrialIds.indexOf(trial.nctId) == -1)
							{
								flags[index].value = true;
							}
							else
							{
								flags[index].value = false;
							}
						}
						else if(criterion.value == 'complete')
						{
							if ($scope.comTrialIds.indexOf(trial.nctId) != -1)
							{
								flags[index].value = true;
							}
							else
							{
								flags[index].value = false;
							}
						}
					}
					else
					{
						var searchStr = '';
						for(var i = 0;i < criterion.value.length-1;i++)
						{
							searchStr += criterion.value[i] + '|';
						}
						searchStr += criterion.value[criterion.value.length-1];
						 console.log('hello world', searchStr);
						var patt = new RegExp(searchStr);
						if(tempStr.match(patt) != undefined)
						{
							flags[index].value = true;
						}
					}

				});

				for(var i = 0;i < flags.length;i++)
				{
					finalFlag = finalFlag && flags[i].value;
				}
				return finalFlag;
			}
		};


		$scope.getCriteria = function(checked, value, type)
		{
			var index = $scope.criteria.map(function(e) { return e.type; }).indexOf(type);
			if(type == 'status')
			{
				if($scope.types.indexOf('status') !== -1)
				{
					_.each($scope.criteria, function(criterion)
					{
						if(criterion.type == 'status')
						{
							criterion.value = value;
						}
					});
				}
				else
				{
					$scope.criteria.push({type: 'status', value: value});
					$scope.types.push('status');
				}

			}
			else
			{
				if(checked)
				{
					if ($scope.types.indexOf(type) == -1)
					{
						$scope.criteria.push({type: type, value: [value]});
						$scope.types.push(type);
					}
					else
					{
						$scope.criteria[index].value.push(value);
					}


				}
				else
				{
					$scope.criteria[index].value = _.without($scope.criteria[index].value, value);
					$scope.types.splice($scope.types.indexOf(type), 1);
				}
			}
		};


	}
]);
