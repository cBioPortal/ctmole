'use strict';

// Mappings controller
angular.module('mappings').controller('MappingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mappings', 'Genes', 'Alterations', 'Cancertypes', 'Drugs',
	function($scope, $stateParams, $location, Authentication, Mappings, Genes, Alterations, CancerTypes, Drugs) {
		$scope.authentication = Authentication;

		$scope.init = function() {
			initParams();
			geneList();
			altList();
			cancerTypeList();
			drugList();
			console.log($scope);
		};

		// Find a list of Mappings
		$scope.find = function() {
			$scope.mappings = Mappings.query();
		};

		$scope.search = function () {
			var groups = [],
				combined = [];

			groups.push($scope.selectedGene);
			groups.push($scope.selectedAlt);
			groups.push($scope.selectedCancerType);

			combined.push(merge(groups[0],groups[1],groups[2]));
			combined.push(merge(groups[0],groups[1]));
			combined.push(merge(groups[1],groups[2]));
			combined.push(merge(groups[0],groups[2]));

			groups.forEach(function(e){
				combined.push({name: e.symbol, nctIds: e.nctIds});
			});

			$scope.trailGroups = combined;
		};

		function merge(a1, a2, a3) {
			var content = {},
			name = [],
			nctIds = [];


			name.push(a1.symbol);
			name.push(a2.symbol);


			if(angular.isObject(a3)) {
				name.push(a3.symbol);
				nctIds = $scope.intersection(a1.nctIds, a2.nctIds, a3.nctIds);
			}else {
				nctIds = $scope.intersection(a1.nctIds, a2.nctIds);
			}

			content.name = name.join(', ');
			content.nctIds = nctIds;

			return content;
		}

		function initParams() {
			$scope.selectedGene = '';
			$scope.selectedAlt = '';
			$scope.selectedCancerType = '';
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