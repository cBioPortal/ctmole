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


		$scope.criteria = [{type: 'country', value: 'United States'}];
		$scope.types = ['country'];

		$scope.countryCriteria = ['United States'];
		$scope.geneCriteria = [];
		$scope.trialsNctIds = [];
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
										}
									});

								}
							);


						}

					},
					function(b)
					{}
				);


			}
			endSearch();
		}

		$scope.showAllCountries = function()
		{
			$scope.allCountries = true;
			$scope.criteria = _.without($scope.criteria, _.where($scope.criteria, {type: 'country'}) );
			$scope.criteria = [{type: 'country', value: 'United States'}];
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
			$scope.criteria = _.without($scope.criteria, _.where($scope.criteria, {type: 'country'}) );
			$scope.criteria = [{type: 'country', value: 'United States'}];
		}
		$scope.search = function() {
			var searchKeyword = $scope.searchKeyword;
			if(searchKeyword === undefined)
			{
				bootbox.alert('please input keyword to start search!');
				return false;
			}
			$scope.loading = true;
			$scope.showResult = false;

			$scope.countries = [];
			$scope.genes = [];
			$scope.mutations = [];
			$scope.mutationIDs = [];

			//search in the trial table
			Trials.searchEngine.query({searchEngineKeyword: searchKeyword}, function (data) {
				console.log('herreing....',data.length);
				for(var i = 0;i < data.length;i++)
				{
					$scope.countries = $scope.countries.concat(data[i].countries);
					$scope.trialsNctIds.push(data[i].nctId);
				}
				$scope.countries = _.uniq($scope.countries);
				$scope.countries = _.without($scope.countries,"United States" );
				if($scope.status == 1)
				{
					searchInAlteration();
				}
				else
				{
					searchMappingByStatus($scope.status);
				}

			});
			//search in the mapping table
			function searchMappingByStatus(statusCode)
			{
				var status = false;
				if(statusCode == 3)
				{
					status = true;
				}

				Mappings.searchByStatus.query({
						status: status
					},
					function (data) {
						if(data.length > 0)
						{
							var nctIds = [];
							for(var i = 0;i < data.length;i++)
							{
								nctIds.push(data[i].nctId);
							}

							$scope.trialsNctIds = _.intersection($scope.trialsNctIds, nctIds);
						}
						searchInAlteration();
					},
					function(error)
					{
						console.log('No hits in the mapping table');
					}
				);
			}

/*
			function searchInMapping()
			{
				Mappings.searchEngine.query({
						searchEngineKeyword: searchKeyword
					},
					function (data) {
						if(data.length > 0)
						{
							var nctIds = [];
							for(var i = 0;i < data.length;i++)
							{
								nctIds.push(data[i].nctId);
							}

							Trials.nctIds.query({nctIds: nctIds},
								function(trialData)
								{
									$scope.trials = $scope.trials.concat(trialData);
									autoCreateFilters(trialData);
								},
								function(trialDataError)
								{
									console.log('not found data', trialDataError);
								})
						}
						searchInAlteration();
					},
					function(error)
					{
						console.log('No hits in the mapping table');
					}
				);
			}
 */
			function searchInAlteration()
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
													autoCreateFilters(trialData);
													//endSearch();
													// trialData;
													$scope.trials = trialData;

												},
												function(trialDataError)
												{
													console.log('not found data', trialDataError);
													//endSearch();
												})
										}


									},
									function(error)
									{
										console.log('did not find data', error);
										endSearch();
									}
								);
							}
						}
						endSearch();


					},
					function(alterationDataError)
					{
						console.log('No hits in the alteration table');
						endSearch();
					}
				)
			}




/*


			var inputs = document.getElementsByTagName("input");
			for(var i = 0; i < inputs.length; i++) {
				if(inputs[i].type == "checkbox") {
					inputs[i].checked = false;
				}
			}
			document.getElementById('US').checked = true;
			document.getElementById(searchKeyword.toUpperCase()).checked = true;
			*/

		};

		/*		$scope.filterByStatus = function(status)
		{
			console.log(status);
			var statusValue = false;
			if(status === 'incomplete')
			{
				statusValue = false;
			}
			else if(status === 'complete')
			{
							statusValue = true;
			}
			Mappings.searchByStatus.query({
				status: statusValue
			},
			function(mappingRecords)
			{
				var nctIds = [];
				if(mappingRecords.length > 0)
				{
					for(var i = 0;i < mappingRecords.length;i++)
					{
						nctIds.push(mappingRecords[i].nctId);
					}
				}
				//console.log(nctIds);
			}
			);
		}

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
*/
		$scope.getCriteria = function(checked, value, type)
		{
			/*
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
			*/

			if(checked)
			{
				switch(type)
				{
					case 'country':
						$scope.countryCriteria.push(value);
						break;
					case 'gene':
						$scope.geneCriteria.push(value);
						break;
				}
			}
			else
			{
				switch(type)
				{
					case 'country':
						$scope.countryCriteria = _.without($scope.countryCriteria, value);
						break;
					case 'gene':
						$scope.geneCriteria = _.without($scope.geneCriteria, value);
						break;
				}
			}
			var searchStr = "";
			_.each($scope.countryCriteria, function(country) {
				searchStr += country + " ";
			})
			searchStr += ", ";
			_.each($scope.geneCriteria, function(gene) {
				searchStr += gene + " ";
			})

			$scope.searchKeyword = searchStr;
			$scope.search();
			//console.log($scope.countryCriteria, $scope.geneCriteria, searchStr);
		};

	}
]);


