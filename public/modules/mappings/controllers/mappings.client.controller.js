'use strict';

// Mappings controller
angular.module('mappings').controller('MappingsController', ['$scope', '$sce', '$stateParams', '$location', '$window', 'Authentication', 'Mappings', 'Genes', 'Alterations', 'Cancertypes', 'Drugs', 'Trials', 'Venn', 'D3',
	function($scope, $sce, $stateParams, $location, $window, Authentication, Mappings, Genes, Alterations, CancerTypes, Drugs, Trials, Venn, D3) {
		$scope.authentication = Authentication;

		$scope.init = function() {
			initParams();
			geneList();
			altList();
			cancerTypeList();
			drugList();
		};

		$scope.findList = function(group) {
			searchTrialsBySelectedGroup(group);
			openMappingList();
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

			venn(groups, angular.copy(combined));
			$scope.trailGroups = combined.map(function(e){e.name = e.name.join(', '); return e;});
		};

		$scope.example = function() {
			$scope.genes.forEach(function(d){
				if (d.symbol === 'BRAF'){
					$scope.selectedGene = d;
				}
			});
			$scope.alts.forEach(function(d){
				if (d.symbol === 'V600E'){
					$scope.selectedAlt = d;
				}
			});
			$scope.cancerTypes.forEach(function(d){
				if (d.symbol === 'melanoma'){
					$scope.selectedCancerType = d;
				}
			});
			$scope.search();
		};

		function searchTrialsBySelectedGroup(group) {
			$scope.selectedGroup = group;
			Trials.listWithnctIds.search($scope.selectedGroup.nctIds, function(data){
				$scope.trials =  data.map(function(d){
					d.eligibilityCriteria = $sce.trustAsHtml(d.eligibilityCriteria.replace(/(?:\r\n|\r|\n)/g, '<br />'));
					return d;
				});
			});
		}

		function openMappingList() {
			$window.open('#!/mappings/list');
		}

		function venn(groups, combined) {
			var sets = groups.map(function(e){
				var datum = {};
				datum.label = e.symbol;
				datum.size = e.nctIds.length;
				datum.nctIds = e.nctIds;
				return datum;
			});

		    var overlaps = combined.map(function(d){
		    	var datum = {
		    		sets: [],
		    		size: 0,
		    		label: [],
		    		nctIds: []
		    	};

		    	d.name.forEach(function(e){
		    		var _index = -1;

		    		for (var i = 0; i < groups.length; i++) {
		    			if(groups[i].symbol === e){
		    				_index = i;
		    				break;
		    			}
		    		}
		    		if(_index !== -1) {
		    			datum.sets.push(_index);
		    			datum.label.push(e);
		    		}
		    	});
		    	datum.size = d.nctIds.length;
		    	datum.nctIds = d.nctIds;
		    	datum.label = datum.label.join(', ');
		    	return datum;
		    }).filter(function(e){
		    	if(e.sets.length > 1) {
		    		return true;
		    	}else {
		    		return false;
		    	}
		    }).reverse();
		    
		    var tooltip = D3.select('#venn').append('div')
    			.attr('class', 'venntooltip');

			console.log(sets, overlaps);

		    // get positions for each set
			sets = Venn.venn(sets, overlaps);

			// draw the diagram in the 'simple_example' div
			D3.select('#venn svg').remove();
			var diagram = Venn.drawD3Diagram(D3.select('#venn'), sets, 300, 300);
			diagram.svg
			.style('display', 'block')
			.style('margin', 'auto');

			//Default color are ['#FF7F0E', '#2CA02C', '#1F77B4']
			
			
			D3.selection.prototype.moveParentToFront = function() {
			  	return this.each(function(){
			    	this.parentNode.parentNode.appendChild(this.parentNode);
			  	});
			};
			// hover on all the circles
			diagram.circles
			    .style('stroke-opacity', 0)
			    .style('stroke', 'white')
			    .style('stroke-width', '2');

			diagram.nodes
			    .on('mousemove', function() {
			        tooltip.style('left', (D3.event.pageX) + 'px')
			               .style('top', (D3.event.pageY - 28) + 'px');
			    })
			    .on('mouseover', function(d, i) {
			        var selection = D3.select(this).select('circle');
			        selection.moveParentToFront()
			            .transition()
			            .style('fill-opacity', 0.5)
			            .style('cursor', 'pointer')
			            .style('stroke-opacity', 1);
			        tooltip.transition().style('opacity', 0.9);
			        tooltip.text(d.size + ' trials');
			    })
			    .on('mouseout', function(d, i) {
			        D3.select(this).select('circle').transition()
			            .style('fill-opacity', 0.3)
			            .style('stroke-opacity', 0);
			        tooltip.transition().style('opacity', 0);
			    })
			    .on('click',function(d, i) {
			    	searchTrialsBySelectedGroup(d);
			    });
			diagram.svg.select('g').selectAll('path')
		    .data(overlaps)
		    .enter()
		    .append('path')
		    .attr('d', function(d) {
		    	var _data = Venn.intersectionAreaPath(d.sets.map(function(j) { return sets[j]; }));
		        return _data;
		    })
		    .style('fill-opacity','0')
		    .style('fill', 'black')
		    .style('stroke-opacity', 0)
		    .style('stroke', 'white')
		    .style('stroke-width', '2')
            .style('cursor', 'pointer')
		    .on('mouseover', function(d, i) {
		        D3.select(this).transition()
		            .style('fill-opacity', 0.1)
		            .style('stroke-opacity', 1);
		        tooltip.transition().style('opacity', 0.9);
		        tooltip.text(d.size + ' trials');
		    })
		    .on('mouseout', function(d, i) {
		        D3.select(this).transition()
		            .style('fill-opacity', 0)
		            .style('stroke-opacity', 0);
		        tooltip.transition().style('opacity', 0);
		    })
		    .on('mousemove', function() {
		        tooltip.style('left', (D3.event.pageX) + 'px')
		               .style('top', (D3.event.pageY - 28) + 'px');
		    })
		    .on('click',function(d, i) {
		    	searchTrialsBySelectedGroup(d);
		    });
		}

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
			});
		}

		function initParams() {
			$scope.selectedGene = '';
			$scope.selectedAlt = '';
			$scope.selectedCancerType = '';
			$scope.selectedGroup = {name: 'NA', nctIds: []};
			$scope.trailGroups = []; //The item should have following structure {name:'', nctIds: []}
		}

		function geneList() {
			$scope.genes = Genes.gene.query();
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