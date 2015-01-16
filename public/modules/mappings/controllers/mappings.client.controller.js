'use strict';

// Mappings controller
angular.module('mappings').controller('MappingsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Mappings', 'Genes', 'Alterations', 'Cancertypes', 'Drugs', 'Trials',
	function($scope, $stateParams, $location, $window, Authentication, Mappings, Genes, Alterations, CancerTypes, Drugs, Trials) {
		$scope.authentication = Authentication;

		$scope.init = function() {
			initParams();
			geneList();
			altList();
			cancerTypeList();
			drugList();
			console.log($scope);
		};

		$scope.findList = function(group) {
			$scope.selectedGroup = group;
			$scope.trials = Trials.listWithnctIds.search($scope.selectedGroup.nctIds);
			$window.open('#!/mappings/list');
		};
		// Find a list of Mappings
		$scope.find = function() {
		};

		$scope.search = function () {
			var groups = [],
				combined = [];

			groups.push($scope.selectedGene);
			groups.push($scope.selectedAlt);
			groups.push($scope.selectedCancerType);

			groups = $scope.compact(groups);
			combined = combination(groups);

			$scope.trailGroups = combined;
		};

		$scope.showTrials = function() {
			console.log($scope);
		};

		function combination(array) {
			var len = array.length;
			var n = 1<<len;
			var result = [];
			for(var i=1;i<n;i++)    //从 1 循环到 2^len -1
			{
				var content = {},
					name = [],
					nctIds = [];
				for(var j=0;j<len;j++)
				{
					var temp = i;
					if(temp & (1<<j))   //对应位上为1，则输出对应的字符
					{
						name.push(array[j].symbol);
						if(nctIds.length === 0) {
							nctIds = array[j].nctIds;
						}else {
							nctIds = $scope.intersection(nctIds, array[j].nctIds);
						}
					}
				}
				content.name = name;
				content.nctIds = nctIds;
				result.push(content);
			}
			return result.sort(function(a,b){
				if(a.name.length > b.name.length) {
					return -1;
				}else {
					return 1;
				}
			}).map(function(e){e.name = e.name.join(', '); return e;});
		}

		function initParams() {
			$scope.selectedGene = '';
			$scope.selectedAlt = '';
			$scope.selectedCancerType = '';
			$scope.selectedGroup = {name: 'NA', nctIds: []};
			$scope.trailGroups = []; //The item should have following structure {name:'', nctIds: []}
		}

		function geneList() {
			$scope.genes = Genes.query();
		}

		function altList() {
			$scope.alts = Alterations.query();
		}

		function cancerTypeList() {
			$scope.cancerTypes = CancerTypes.query();
		}

		function drugList() {
			$scope.drugs = Drugs.full.query();
		}
	}
]);