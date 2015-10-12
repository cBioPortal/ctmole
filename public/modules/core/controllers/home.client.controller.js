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
		$scope.searchStr = '';
		$scope.geneCriteria = [];
		$scope.mutationCriteria = [];
		$scope.trialsNctIds = [];

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

									checkSelectedItems();
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

		function checkSelectedItems()
		{
			_.each($scope.countryCriteria, function(country)
			{
				var countryItem =  document.getElementById(country);
				if(countryItem != undefined)
				{
					console.log('first..', country);
					countryItem.checked = true;
				}
			})

			if($scope.firstSearch == true)
			{
				console.log('here...',$scope.genes);
				_.each($scope.genes, function(gene){
					if($scope.searchKeyword.toUpperCase() == gene)
					{
						var geneItem =  document.getElementById(gene);
						if(geneItem != undefined)
						{
							console.log('first..', gene);
							geneItem.checked = true;
						}

						$scope.geneCriteria.push(gene);
					}

				});

			}
			else
			{
				var checkedGenes = _.intersection($scope.genes, $scope.geneCriteria);
				console.log('now it is here', checkedGenes);
				_.each(checkedGenes, function(gene) {
					var geneItem =  document.getElementById(gene);
					if(geneItem != undefined)
					{
						console.log('hare..', gene);
						geneItem.checked = true;
					}

				});
			}



		}

		$scope.showAllCountries = function()
		{
			$scope.allCountries = true;
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
			$scope.countryCriteria = ['United States'];
			$scope.search();
		}
		$scope.search = function(searchStr) {
			var searchKeyword = $scope.searchKeyword;
			if(searchKeyword === undefined)
			{
				bootbox.alert('please input keyword to start search!');
				return false;
			}
			if(searchStr == 'first')
			{
				searchKeyword = {keyword: $scope.searchKeyword, countries: ["United States"]}
			}
			else
			{
				$scope.firstSearch = false;
				searchKeyword = {keyword: $scope.searchKeyword, countries: $scope.countryCriteria, genes: $scope.geneCriteria}
			}
			$scope.searchStr = JSON.stringify(searchKeyword);
			console.log('here is thete', searchKeyword);
			$scope.loading = true;
			$scope.showResult = false;
			$scope.showRefine = false;

			$scope.countries = [];
			$scope.genes = [];
			$scope.mutations = [];
			$scope.mutationIDs = [];

			//search in the trial table
			Trials.searchEngine.query({searchEngineKeyword: $scope.searchStr}, function (data) {
				for(var i = 0;i < data.length;i++)
				{
					$scope.countries = $scope.countries.concat(data[i].countries);
					$scope.trialsNctIds.push(data[i].nctId);
				}
				$scope.countries = _.uniq($scope.countries);
				$scope.countries = _.without($scope.countries,"United States" );
				$scope.countries.sort();
				searchInAlteration($scope.searchStr);
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
							var nctIds = [];
							for(var i = 0;i < data.length;i++)
							{
								nctIds.push(data[i].nctId);
							}
							if($scope.status == 3)
							{
								$scope.trialsNctIds = _.intersection($scope.trialsNctIds, nctIds);
							}
							else if($scope.status == 2)
							{
								_.each(nctIds, function(nctId){
									$scope.trialsNctIds = _.without($scope.trialsNctIds, nctId);
								});
							}

							if($scope.mutationCriteria.length > 0)
							{
								_.each($scope.mutationCriteria, function(mutation)
								{
									Alterations.alteration.get({alteration: mutation.alteration, gene: mutation.gene}, function (u, getResponseHeaders) {

										console.log('alteration existed...');
										Mappings.searchByAltId.query({altId: u._id},
											function(a){
												console.log(a, 'hello world');
											},
											function(b){
												console.log(b, 'this is error');
											}
										);

									});
								});

							}

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

						} console.log('hits in the mapping table', $scope.trialsNctIds);

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

											searchMappingByStatus();


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

		$scope.getCriteria = function(checked, value, type)
		{
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
					case 'mutation':
						$scope.mutationCriteria.push(value);
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
					case 'mutation':
						$scope.mutationCriteria = _.without($scope.mutationCriteria, value);
						break;
				}
			}

			$scope.geneCriteria = _.uniq($scope.geneCriteria);
			$scope.countryCriteria = _.uniq($scope.countryCriteria);
			$scope.mutationCriteria = _.uniq($scope.mutationCriteria);

			console.log('here is gene criteria', $scope.geneCriteria, $scope.countryCriteria, $scope.mutationCriteria);

			$scope.search();

		};


	}
]);
