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
		$scope.trials = [];


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
		function compare(a,b) {
			if (a.last_nom < b.last_nom)
				return -1;
			if (a.last_nom > b.last_nom)
				return 1;
			return 0;
		}

		function autoCreateFilters(data)
		{
			_.each(data, function(trialItem)
			{
					Mappings.mappingSearch.get({
							Idvalue: trialItem.nctId
						},
						function(a)
						{
							if(a.alteration) {
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
													$scope.mutations.push({gene: value.gene, alteration: value.alteration, nctIds: [ trialItem.nctId ] });
													$scope.genes.push(value.gene);
													$scope.genes = _.uniq($scope.genes);
												}
												else
												{
													_.each($scope.mutations, function(mutation)
													{
														if(mutation.gene == value.gene && mutation.alteration == value.alteration)
														{
															mutation.nctIds.push(trialItem.nctId);
														}
													});
												}
											});
											$scope.mutations.sort(compare);
											$scope.genes.sort();
										}
									);


								}
							}

						},
						function(b)
						{}
					);

			});


		}


		$scope.showAllCountries = function()
		{
			$scope.allCountries = true;
			_.each($scope.criteria, function(criterion)
			{
				if(criterion.type == 'country')
				{
					criterion.value = ['United States'];
				}
			});

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
			$scope.tumorTypes = [];

			//search in the trial table
			Trials.searchEngine.query({searchEngineKeyword: searchKeyword}, function (data) {
					if(data instanceof  Array) {

						if(data.length == 0)
						{
							bootbox.alert('Sorry no result found! Please change your input to restart search');
							$scope.searchKeyword = '';
							$scope.loading = false;
							return false;
						}
						else
						{
							for(var i = 0;i < data.length;i++)
							{
								$scope.countries = $scope.countries.concat(data[i].countries);
								$scope.trialsNctIds.push(data[i].nctId);
								_.each(data[i].tumorTypes, function(tumorItem)
								{

									$scope.tumorTypes.push(tumorItem.tumorTypeId);
								});
							}
							$scope.tumorTypes = _.uniq($scope.tumorTypes);
							$scope.tumorTypes.sort();

							$scope.countries = _.uniq($scope.countries);
							$scope.countries.sort();

							searchMappingByStatus();
							$scope.trials = data;
							autoCreateFilters(data);
							endSearch();
						}
					}


			},
			function(error)
			{

				console.log('search trial error happened');
			}
			);
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

		};

		$scope.searchCriteria = function() {
			return function(trial) {
				var tempStr = JSON.stringify(trial);
				var finalFlag = true;
				var flags = [];

				var types = $scope.types;
				for(var i = 0;i < types.length;i++)
				{
					flags.push({type: types[i], value: false});
				}
				_.each($scope.criteria, function(criterion)
				{
					var index = $scope.criteria.map(function(e) { return e.type; }).indexOf(criterion.type);
					if(criterion.type == 'status')
					{
						if(criterion.value == 'incomplete')
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
					else if(criterion.type == 'mutation')
					{
						var mutationNctIds = [];
						_.each(criterion.value, function(item)
						{
							mutationNctIds = mutationNctIds.concat(item.nctIds);
						});
						if (mutationNctIds.indexOf(trial.nctId) != -1)
						{
							flags[index].value = true;
						}
						else
						{
							flags[index].value = false;
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
			if(type == 'status' || type == 'tumor' || type == 'country')
			{
				if(value.length == 0)
				{
					$scope.types = _.without($scope.types, type);
					$scope.criteria.splice(index, 1);
				}
				else
				{
					if($scope.types.indexOf(type) !== -1)
					{
						_.each($scope.criteria, function(criterion)
						{
							if(criterion.type == type)
							{
								criterion.value = value;
							}
						});
					}
					else
					{
						$scope.criteria.push({type: type, value: value});
						$scope.types.push(type);
					}
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
					if($scope.criteria[index].value.length > 1)
					{
						$scope.criteria[index].value = _.without($scope.criteria[index].value, value);
					}
					else
					{
						$scope.criteria.splice(index, 1);
						$scope.types = _.without($scope.types, type);
					}

				}
			}

		};


	}
]);

