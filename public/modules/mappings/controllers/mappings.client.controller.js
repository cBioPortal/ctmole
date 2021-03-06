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

// Mappings controller
angular.module('mappings').controller('MappingsController', ['$scope', '$sce', '_', '$stateParams', '$location', '$window', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Authentication', 'Mappings', 'Genes', 'Alterations', 'Cancertypes', 'Drugs', 'Trials', 'Venn', 'D3', 'S',
	function($scope, $sce, _, $stateParams, $location, $window, DTOptionsBuilder, DTColumnDefBuilder, Authentication, Mappings, Genes, Alterations, CancerTypes, Drugs, Trials, Venn, D3, S) {
		$scope.authentication = Authentication;

		$scope.init = function() {
			initParams();
			geneList();
			altList();
			cancerTypeList();
			drugList();
		};

		$scope.findList = function(group) {
			searchTrialsBySelectedGroup(group, function(){
				openMappingList();
			});
		};

		// Find a list of Mappings
		$scope.find = function() {
		};

		$scope.search = function () {
			var groups = [],
				combined = [];

			$scope.trials = [];

			initCheckboxVal();

			groups.push($scope.selectedVariants.gene);
			groups.push($scope.selectedVariants.alt);
			groups.push($scope.selectedVariants.cancerType);
			groups = $scope.compact(groups);

			combined = combination(groups);
			venn(groups, angular.copy(combined));
			
			$scope.trailGroups = combined.map(function(e){e.name = e.name.join(', '); return e;});
			$scope.$watch('checkboxVal', function(n, o){
				if($scope.trials && $scope.trials.length > 0){
					var nctIds = $scope.trials.map(function(d){return d.nctId;});
					for(var key in n) {
						if(!n[key]) {
							nctIds = _.difference(nctIds, $scope.selectedVariants[key].nctIds);
						}
					}
					$scope.selectedTrials = $scope.trials.filter(function(d){
						if(nctIds.indexOf(d.nctId) !== -1) {
							return true;
						}else {
							return false;
						}
					});
				}
			}, true);
		};

		$scope.example = function() {
			$scope.genes.forEach(function(d){
				if (d.symbol === 'BRAF'){
					$scope.selectedVariants.gene = d;
				}
			});
			$scope.alts.forEach(function(d){
				if (d.symbol === 'V600E'){
					$scope.selectedVariants.alt = d;
				}
			});
			$scope.cancerTypes.forEach(function(d){
				// if (d.symbol === 'colorectal cancer'){
				if (d.symbol === 'melanoma'){
					$scope.selectedVariants.cancerType = d;
				}
			});
			$scope.search();
		};

		$scope.showCheckbox = function(variant) {
			if(!variant) {
				return false;
			}
			if($scope.selectedGroup.variants.indexOf(variant) === -1) {
				return true;
			}else {
				return false;
			}
		};

		function searchTrialsBySelectedGroup(group, callback) {
			$scope.selectedGroup = group;
			Trials.listWithnctIds.search($scope.selectedGroup.nctIds, function(data){
				$scope.trials =  data.map(function(d){
					var regex = new RegExp($scope.selectedGroup.label.replace(/,\s*/g, '|'), 'gi');
					var ec = d.eligibilityCriteria.replace(/[\n\r]{2}\s+/g, 'zhxzhx').replace(/[\n\r]{1}\s+/g, ' ').replace(/zhxzhx/g, '\n');
					
					for(var key in $scope.selectedVariants) {
						var _symbol = $scope.selectedVariants[key].symbol;
						var _regex = new RegExp(_symbol, 'g');
						if(key === 'alt') {
							var subGene = /([a-zA-Z]+\d+)[a-zA-Z]+/.exec(_symbol);
							_regex = new RegExp(_symbol + '|' + subGene[1], 'g');
						}
						var _html = '<span class="highlight">' + _symbol + '</span>';
						// console.log(_regex, _html);
						ec = ec.replace(_regex, _html);
					}

					d.eligibilityCriteria = S(ec).lines().filter(function(e){
						if(regexIndexOf(e, regex, 0, d) !== -1) {
							return true;
						}else {
							return false;
						}
					});
					d.intervention = d.drugs.map(function(e){ return e.drugName;}).join(', ');
					return d;
				});
				$scope.selectedTrials = angular.copy($scope.trials);
				initCheckboxVal();
				console.log($scope.selectedTrials.map(function(d){ return d.nctId;}));
				if(angular.isFunction(callback)) {
					callback();
				}
			});
		}

		function initCheckboxVal() {
		    $scope.checkboxVal = {};
			for(var key in $scope.selectedVariants){
				$scope.checkboxVal[key] = true;
			}
		}

		function openMappingList() {
			$window.open('#!/mappings/list');
		}

		function regexIndexOf(string, regex, startpos, d) {
		    var indexOf = string.substring(startpos || 0).search(regex);
		    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
		}
		function venn(groups, combined) {
			var sets = groups.map(function(e,i){
				var datum = {};
                datum.name = e.symbol;
                datum.sets = [i];
				datum.label = e.symbol;
				datum.size = e.nctIds.length;
				datum.nctIds = e.nctIds;
				datum.variants = [e.symbol];
				return datum;
			});

		    var overlaps = combined.map(function(d){
		    	var datum = {
		    		sets: [],
		    		size: 0,
		    		label: '',
                    name: '',
		    		variants: [],
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
		    			datum.variants.push(e);
		    		}
		    	});
		    	datum.size = d.nctIds.length;
		    	datum.nctIds = d.nctIds;
		    	datum.label = '';
                datum.name = datum.variants.join(', ');
		    	return datum;
		    }).filter(function(e){
		    	if(e.sets.length > 1) {
		    		return true;
		    	}else {
		    		return false;
		    	}
		    }).reverse();

            sets = sets.concat(overlaps);

		    var tooltip = D3.select('#venn').append('div')
    			.attr('class', 'venntooltip');

		    // get positions for each set
            //sets = Venn.venn(sets);

			// draw the diagram in the 'simple_example' div
			D3.select('#venn svg').remove();

            D3.selection.prototype.moveParentToFront = function() {
                return this.each(function(){
                    this.parentNode.parentNode.appendChild(this.parentNode);
                });
            };

            var chart = Venn.VennDiagram()
                .width(500)
                .height(300);
			var div = D3.select('#venn');
            div.datum(sets).call(chart);

            div.selectAll('path')
                .style('stroke-opacity', 0)
                .style('stroke', '#fff')
                .style('stroke-width', 0);

            div.selectAll('g')
                .on('mouseover', function(d, i) {
                    // sort all the areas relative to the current item
                    Venn.sortAreas(div, d);

                    var selection = D3.select(this).select('circle');

                    selection.moveParentToFront()
                       .transition()
                       .style('fill-opacity', 0.5)
                       .style('cursor', 'pointer')
                       .style('stroke-opacity', 1);

                    // Display a tooltip with the current size
                    tooltip.transition().duration(400).style('opacity', 0.9);
                    tooltip.text(d.size + ' users');
                    // highlight the current path
                    selection = D3.select(this).transition('tooltip').duration(400);
                    selection.select('path')
                        .style('stroke-width', 3)
                        .style('fill-opacity', d.sets.length === 1 ? 0.4 : 0.1)
                        .style('stroke-opacity', 1);
                })
                .on('mousemove', function() {
                    tooltip.style('left', (D3.event.pageX) + 'px')
                        .style('top', (D3.event.pageY - 28) + 'px');
                })
                .on('mouseout', function(d, i) {
                    tooltip.transition().duration(400).style('opacity', 0);
                    var selection = D3.select(this).transition('tooltip').duration(400);
                    selection.select('path')
                        .style('stroke-width', 0)
                        .style('fill-opacity', d.sets.length === 1 ? 0.25 : 0.0)
                        .style('stroke-opacity', 0);
                })
                .on('click',function(d, i) {
                    searchTrialsBySelectedGroup(d);
                });
		}

		function combination(array) {
			var len = array.length;
			var n = 1<<len;
			var result = [];
			for(var i=1;i<n;i++)
			{
				var content = {},
					name = [],
					nctIds = [];
				for(var j=0;j<len;j++)
				{
					var temp = i;
					if(temp & (1<<j))
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
			$scope.selectedVariants = {
				gene: '',
				alt: '',
				cancerType: ''
			};

			$scope.selectedGroup = {name: 'NA', nctIds: []};
			$scope.trailGroups = []; //The item should have following structure {name:'', nctIds: []}
			$scope.dtOptions = DTOptionsBuilder
				.newOptions()
				.withDOM('lifrtp')
				.withBootstrap();
			$scope.dtColumns =  [
		        DTColumnDefBuilder.newColumnDef(0),
		        DTColumnDefBuilder.newColumnDef(1),
		        DTColumnDefBuilder.newColumnDef(2),
		        DTColumnDefBuilder.newColumnDef(3).notSortable()
		    ];
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