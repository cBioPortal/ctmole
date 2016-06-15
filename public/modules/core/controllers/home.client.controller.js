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
angular.module('core').controller('HomeController', ['$scope', '$location', '$rootScope', 'Authentication', 'Trials', 'Mappings', 'Alterations', 'Cancertypes',
    function ($scope, $location, $rootScope, Authentication, Trials, Mappings, Alterations, Cancertypes) {

        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.loading = false;
        $scope.showResult = false;
        $scope.allCountries = true;
        $scope.firstSearch = true;
        $scope.refineFlag = false;
        $scope.dashBoard = true;
        $scope.loadingTumorData = true;
        $scope.loadingGeneData = true;
        $scope.loadingStatusData = true;
        $scope.loadingCurationStatusData = true;
        $scope.countNum = 10;
        $scope.mutations = [];
        $scope.countryCriteria = ['United States'];
        $scope.criteria = [{type: 'country', value: ['United States']}];
        $scope.types = ['country'];
        $scope.geneCriteria = [];
        $scope.mutationCriteria = [];
        $scope.trialsNctIds = [];
        $scope.comTrialIds = [];
        $scope.inComTrialIds = [];
        $scope.status = 4;
        $scope.recruit = '';
        $scope.recruitingStatus = ['Not yet recruiting', 'Recruiting', 'Enrolling by invitation', 'Active, not recruiting', 'Completed', 'Others'];
        $scope.chosenRecruits = ['Recruiting'];
        
        var allGenes = [], allAlts = [], allAlterations = [];

        $scope.searchValues = {gene: ' ', alteration: ' ', tumorType: ' ', otherContent: ' '};
        $scope.fruits = ['apple', 'banana', 'pineapple', 'berry']; 
        function compare(a, b) {
            if (a.gene < b.gene)
                return -1;
            if (a.gene > b.gene)
                return 1;
            return 0;
        }

        function sortTumor(a, b) {
            return a.nctIds.length - b.nctIds.length;
        }


        $scope.searchTrials = function () {
console.log('search gene ', $scope.searchValues);
            if ($scope.searchValues.gene === ' ' && $scope.searchValues.alteration === ' ' && $scope.searchValues.tumorType === ' ' && $scope.searchValues.otherContent === ' ') {
                bootbox.alert('please input keyword to start search!');
                return false;
            }
            $scope.loading = true;
            $scope.showResult = false;

            $scope.countries = [];
            $scope.genes = [];
            $scope.mutations = [];
            $scope.mutationIDs = [];
            $scope.tumorTypes = [];
            $scope.trialsNctIds = [];
            $scope.country = ['United States'];

            $scope.previousSearch = $scope.searchValues.otherContent;
//            $location.search('status', '4');
//            $location.search('country', 'United States');
//            if ($scope.searchValues.gene !== ' ') {
//                $location.search('gene', $scope.searchValues.gene);
//            }
//            if ($scope.searchValues.alteration !== ' ') {
//                $location.search('alteration', $scope.searchValues.alteration);
//            }
//            if ($scope.searchValues.tumorType !== ' ') {
//                $location.search('tumorType', $scope.searchValues.tumorType);
//            }
//            if ($scope.searchValues.otherContent !== ' ') {
//                $location.search('otherContent', $scope.searchValues.otherContent);
//            }
            //search in the trial table
            Trials.searchEngine.query({gene: $scope.searchValues.gene, alteration: $scope.searchValues.alteration, tumorType: $scope.searchValues.tumorType, otherContent: $scope.searchValues.otherContent}, function (data) {
                var trials = data.slice(0, data.length - 1);

                if (trials.length === 0) {
                    bootbox.alert('Sorry no result found! Please change your input to restart search');

                    $scope.loading = false;
                    return false;
                } else {

                    $(window).scroll(function () {
                        if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                            $scope.$apply(function () {
                                if ($scope.countNum < trials.length) {
                                    $scope.countNum += 10;
                                }

                            });

                        }
                    });

                    for (var i = 0; i < trials.length; i++) {
                        $scope.countries = $scope.countries.concat(trials[i].countries);
                        $scope.trialsNctIds.push(trials[i].nctId);
                        $scope.tumorTypes = $scope.tumorTypes.concat(trials[i].tumorTypes);

                    }

                    var altRecords = data[data.length - 1];
                    var tempIndex = -1, i = 0, item, tempAltIndex = -1;
                    while (altRecords[i] !== undefined)
                    {
                        tempIndex = -1;
                        item = altRecords[i];
                        tempIndex = _.map(allGenes, function (e) {
                            return e.gene;
                        }).indexOf(altRecords[i].gene);
                        if (tempIndex === -1) {
                            allGenes.push({gene: item.gene, nctIds: item.nctIds});
                        } else
                        {
                            allGenes[tempIndex].nctIds.concat(item.nctIds);
                            allGenes[tempIndex].nctIds = _.uniq(allGenes[tempIndex].nctIds);
                        }

                        tempAltIndex = -1;
                        if (item.alteration !== 'unspecified') {
                            for (var j = 0; j < allAlts.length; j++) {
                                if (allAlts[j].gene === item.gene && allAlts[j].alteration === item.alteration) {
                                    tempAltIndex = j;
                                    break;
                                }
                            }
                            if (tempAltIndex === -1) {
                                allAlts.push({gene: item.gene, alteration: item.alteration, nctIds: item.nctIds});
                            } else {
                                allAlts[tempAltIndex].nctIds.concat(item.nctIds);
                                allAlts[tempAltIndex].nctIds = _.uniq(allAlts[tempAltIndex].nctIds);
                            }
                            
                            
                        }
                        i++;
                    }

                    $scope.genes = _.map(allGenes, function (e) {
                        return e.gene;
                    });
                    $scope.genes.sort();


                    $scope.tumorTypes = _.uniq($scope.tumorTypes);
                    $scope.tumorTypes.sort();

                    $scope.countries = _.uniq($scope.countries);
                    $scope.countries.sort();

                    $scope.mutations = allAlts;
                    $scope.mutations.sort(compare);
                
                    Mappings.searchByStatus.query({},
                            function (data) {
                                if (data.length > 0) {
                                    var tempComTrialIds = [], tempIncomTrialIds = [], tempIndex = -1, tempArr = $scope.trialsNctIds;
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].completeStatus === '2') {
                                            tempIncomTrialIds.push(data[i].nctId);
                                        } else if (data[i].completeStatus === '3') {
                                            tempComTrialIds.push(data[i].nctId);
                                        }
                                        tempIndex = tempArr.indexOf(data[i].nctId); 
                                        if (tempIndex !== -1) {
                                            trials[tempIndex].fetchedAlterations = data[i].alterations;
                                        }
                                    }
                                    $scope.comTrialIds = tempComTrialIds;
                                    $scope.inComTrialIds = tempIncomTrialIds;
                                }
                                //                    if ($scope.showResult) {
//                        refine();
//                    } 
                                $scope.trials = trials;
                                $scope.loading = false;
                                $scope.showResult = true;

                            },
                            function (error) {
                                console.log('Error happened ', error);
                            }
                    );


                }
            },
                    function (error) {
                        bootbox.alert('Oops Error occurred to search engine, please try again!');
                        console.log('search trial error happened');
                        return false;
                    }
            );

        };

        function refine() {
            var location = $location.search();
            var tempCriteria = [];
            var tempTypes = [];


            $scope.chosenGenes = [];
            $scope.chosenMutations = [];
            $scope.chosenRecruits = [];
            $scope.tumor = [];
            $scope.status = 4;
            for (var property in location) {
                if (property !== 'otherContent') {
                    if (property === 'status') {
                        $scope.status = location[property];
                    }


                    if (Array.isArray(location[property])) {
                        if (property === 'mutation') {
                            var temAlteration = [];

                            _.each(location[property], function (item) {
                                var alts = item.split(',');
                                _.each($scope.mutations, function (altItem) {
                                    if (altItem.gene === alts[0] && altItem.alteration === alts[1]) {
                                        temAlteration.push(altItem);
                                    }
                                });
                            });

                            tempCriteria.push({type: property, value: temAlteration});
                        } else {
                            tempCriteria.push({type: property, value: location[property]});
                        }


                        if (property === 'tumor') {
                            $scope.tumor = location[property];
                        } else if (property === 'gene') {
                            $scope.chosenGenes = location[property];
                        } else if (property === 'mutation') {
                            $scope.chosenMutations = location[property];
                        } else if (property === 'country') {
                            $scope.country = location[property];
                        } else if (property === 'recruit') {
                            $scope.chosenRecruits = location[property];
                        }

                    } else {
                        if (property === 'mutation') {
                            var temAlteration = [];
                            var alts = location[property].split(',');
                            _.each($scope.mutations, function (item) {
                                if (item.gene === alts[0] && item.alteration === alts[1]) {
                                    temAlteration = item;
                                }
                            });
                            tempCriteria.push({type: property, value: temAlteration});
                        } else {
                            tempCriteria.push({type: property, value: [location[property]]});
                        }

                        if (property === 'tumor') {
                            $scope.tumor = [location[property]];
                        } else if (property === 'gene') {
                            $scope.chosenGenes = [location[property]];
                        } else if (property === 'mutation') {
                            $scope.chosenMutations = [location[property]];
                        } else if (property === 'country') {
                            $scope.country = [location[property]];
                        } else if (property === 'recruit') {
                            $scope.chosenRecruits = [location[property]];
                        }

                    }

                    tempTypes.push(property);


                }
            }
            $scope.criteria = tempCriteria;
            $scope.types = tempTypes;
        }
        
        $scope.find = function () {

            $scope.refineFlag = false;
            $scope.criteria = [{type: 'country', value: ['United States']}, {type: 'recruit', value: ['Recruiting']}];
            $scope.types = ['country', 'recruit'];

            var location = $location.search();
            if (location.otherContent !== undefined) {
                console.log('here go to search');
                $scope.searchKeyword = location.otherContent;
                $scope.refineFlag = true;
                $scope.search();

            }
            _.each(document.getElementsByClassName('filterStyle'), function (item) {
                item.style.maxHeight = (window.innerHeight - 620) / 2 + 'px';
            });
            Alterations.allAlterations.get({}, function(data){
                var tempIndex = -1, hugoGenes = [], inputAlterations = [];
                for(var i = 0;i < data.length;i++){
                    tempIndex = _.map(allAlterations, function(item){return item.gene;}).indexOf(data[i].gene);
                    if(tempIndex === -1){
                        allAlterations.push({gene: data[i].gene, alterations: [data[i].alteration]});
                        hugoGenes.push(data[i].gene);
                        
                    }else{
                        allAlterations[tempIndex].alterations.push(data[i].alteration);
                    }
                    inputAlterations.push(data[i].alteration);
                   
                }
                $scope.HUGOgenes = hugoGenes.sort();
                $scope.inputAlterations = _.uniq(inputAlterations).sort();
                 
            });

        };
        $scope.updateInputAlterations = function(){
            console.log('chosen gene ', $scope.searchValues.gene);
            for(var i = 0;i < allAlterations.length;i++){
                if(allAlterations[i].gene === $scope.searchValues.gene){
                    $scope.inputAlterations = allAlterations[i].alterations.sort();
                    break;
                }
                    
            } 
        }
        

//        $rootScope.$on('$locationChangeSuccess', function (event) { console.log('right direction......');
//            var location = $location.search();
//            if (location.otherContent !== undefined) {
//                if ($scope.previousSearch !== location.otherContent) {
//                    $scope.searchKeyword = location.otherContent;
//                    $scope.search();
//                }
//                refine();
//            } else {
//                $scope.showResult = false;
//                $scope.searchKeyword = '';
//            }
//
//        });

        $scope.searchCriteria = function () {
 
            return function (trial) {

                var tempStr = JSON.stringify(trial);
                var finalFlag = true;
                var flags = [];

                var types = $scope.types;
                for (var i = 0; i < types.length; i++) {
                    flags.push({type: types[i], value: false});
                }
                _.each($scope.criteria, function (criterion) {
                    var index = $scope.criteria.map(function (e) {
                        return e.type;
                    }).indexOf(criterion.type);

                    if (criterion.type === 'status') {
                        var tempVal = criterion.value[0];
                        if (tempVal === '1') {
                            if ($scope.comTrialIds.indexOf(trial.nctId) === -1 && $scope.inComTrialIds.indexOf(trial.nctId) === -1) {
                                flags[index].value = true;
                            } else {
                                flags[index].value = false;
                            }
                        } else if (tempVal === '2') {
                            if ($scope.inComTrialIds.indexOf(trial.nctId) !== -1) {
                                flags[index].value = true;
                            } else {
                                flags[index].value = false;
                            }
                        } else if (tempVal === '3') {
                            if ($scope.comTrialIds.indexOf(trial.nctId) !== -1) {
                                flags[index].value = true;
                            } else {
                                flags[index].value = false;
                            }
                        } else if (tempVal === '4') {
                            flags[index].value = true;
                        }
                    } else if (criterion.type === 'mutation') {

                        var mutationNctIds = [];
                        _.each(criterion.value, function (item) {
                            mutationNctIds = mutationNctIds.concat(item.nctIds);
                        });
                        if (mutationNctIds.indexOf(trial.nctId) !== -1) {
                            flags[index].value = true;
                        } else {
                            flags[index].value = false;
                        }

                    } else if (criterion.type === 'gene') {

                        var mutationNctIds = [];
                        _.each(criterion.value, function (item) {
                            _.each(allGenes, function (item1) {
                                if (item1.gene === item)
                                {
                                    mutationNctIds = mutationNctIds.concat(item1.nctIds);
                                }
                            });
                        });
                        if (mutationNctIds.indexOf(trial.nctId) !== -1) {
                            flags[index].value = true;
                        } else {
                            flags[index].value = false;
                        }
                    } else {

                        var searchStr = '';
                        for (var i = 0; i < criterion.value.length - 1; i++) {
                            searchStr += criterion.value[i] + '|';
                        }
                        searchStr += criterion.value[criterion.value.length - 1];
                        var patt = new RegExp(searchStr);
                        if (tempStr.match(patt)) {
                            flags[index].value = true;
                        }
                    }

                });

                for (var i = 0; i < flags.length; i++) {
                    finalFlag = finalFlag && flags[i].value;
                }
                return finalFlag;

            };
        };


        $scope.getCriteria = function (checked, value, type) {
 
            var index = $scope.criteria.map(function (e) {
                return e.type;
            }).indexOf(type);

            if (type === 'status' || type === 'tumor' || type === 'country') {


                if (value.length === 0) {
                    $scope.types = _.without($scope.types, type);
                    $scope.criteria.splice(index, 1);
                } else {
                if ($scope.types.indexOf(type) !== -1) {
                    _.each($scope.criteria, function (criterion) {
                        if (criterion.type === type) {
                            criterion.value = value;
                        }
                    });
                } else {
                    $scope.criteria.push({type: type, value: value});
                    $scope.types.push(type);
                }
                }

            } else {
                if (checked) {
                    if ($scope.types.indexOf(type) === -1) {
                        if (type === 'recruit' && value === 'Others')
                        {
                            $scope.criteria.push({type: type, value: ['Suspended', 'Terminated', 'Withdrawn']});
                            $scope.types.push(type);
                        } else
                        {
                            $scope.criteria.push({type: type, value: [value]});
                            $scope.types.push(type);
                        }

                    } else {
                        if (type === 'recruit' && value === 'Others')
                        {
                            $scope.criteria[index].value.push('Suspended');
                            $scope.criteria[index].value.push('Terminated');
                            $scope.criteria[index].value.push('Withdrawn');
                        } else
                        {
                            $scope.criteria[index].value.push(value);
                        }


                    }


                } else {

                    if ($scope.criteria[index].value.length > 1) {
                    if (type === 'recruit' && value === 'Others' && $scope.criteria[index].value.length > 3)
                    {
                        $scope.criteria[index].value = _.without($scope.criteria[index].value, 'Suspended');
                        $scope.criteria[index].value = _.without($scope.criteria[index].value, 'Terminated');
                        $scope.criteria[index].value = _.without($scope.criteria[index].value, 'Withdrawn');

                    } else if (type === 'recruit' && value === 'Others' && $scope.criteria[index].value.length === 3)
                    {
                        $scope.criteria.splice(index, 1);
                        $scope.types = _.without($scope.types, type);
                    } else
                    {
                        $scope.criteria[index].value = _.without($scope.criteria[index].value, value);
                    }
                    } else {

                        $scope.criteria.splice(index, 1);
                        $scope.types = _.without($scope.types, type);
                    }

                }
            }
//            var currParams = $location.search();

//            for (var paramName in currParams) {
//                if (paramName !== 'otherContent') {
//                    $location.search(paramName, null);
//                }
//
//            }
//            _.each($scope.criteria, function (criterion) {
//                if (criterion.type === 'mutation') {
//                    console.log(criterion.value);
//                    var tempArr = criterion.value.map(function (e) {
//                        return e.gene + ',' + e.alteration;
//                    });
//                    $location.search(criterion.type, tempArr);
//
//                } else {
//                    $location.search(criterion.type, criterion.value);
//                }
//
//
//            });
            //criteria array is fine till here
            console.log('here comes the chosen criteria ', $scope.criteria);
        };

        function plottyChart() {
            //get the gene and trials infor

            Mappings.geneTrialCounts.get({}, function (result) {
                $scope.loadingGeneData = false;
                var geneTrace1 = {
                    y: _.map(result, function (item) {
                        return item.gene;
                    }),
                    x: _.map(result, function (item) {
                        return item.predicted.length;
                    }),
                    name: 'Predicted',
                    type: 'bar',
                    orientation: 'h'
                };

                var geneTrace2 = {
                    y: _.map(result, function (item) {
                        return item.gene;
                    }), //['BRAF', 'KIT', 'KRAS', 'ALK', 'MET', 'EGFR', 'PTEN'],
                    x: _.map(result, function (item) {
                        return item.curated.length;
                    }), //[12, 18, 29, 2, 4, 10, 9],
                    name: 'Curated',
                    type: 'bar',
                    orientation: 'h'
                };
                var geneLayout = {barmode: 'stack',
                    width: 450,
                    height: 15 * result.length,
                    margin: {
                        l: 125,
                        t: 10,
                        r: 10

                    }};
                var geneData = [geneTrace1, geneTrace2];
                Plotly.newPlot('geneTrails', geneData, geneLayout, {displayModeBar: false});

                var tempNctIds = [];
                _.each(result, function (item) {
                    tempNctIds.push(item.predicted);
                    tempNctIds.push(item.curated);
                });
                tempNctIds = _.uniq(tempNctIds);
                $scope.trialsMappingCount = tempNctIds.length;
                
                
                var myPlot = document.getElementById("geneTrails");
                myPlot.on('plotly_click', function (eventData) {
                    $scope.searchValues.gene = eventData.points[0].y;
                    $scope.searchTrials();
                });
              
            });


            Cancertypes.tumorTypes.get({}, function (result) {

                result.sort(sortTumor);
                $scope.loadingTumorData = false;
                var tumorType = {
                    x: _.map(result, function (item) {
                        return item.nctIds.length;
                    }),
                    y: _.map(result, function (item) {
                        return item.OncoKBCancerType;
                    }),
                    type: 'bar',
                    orientation: 'h'

                };

                var tumorLayout = {barmode: 'stack',
                    width: 450,
                    height: 20 * result.length,
                    yaxis: {
                        tickangle: -30,
                        tickfont: {
                            size: 8,
                        }
                    },
                    margin: {
                        l: 150,
                        t: 10,
                        r: 10
                    }
                };

                var allNctIds = [];
                _.map(result, function (item) {
                    allNctIds = allNctIds.concat(item.nctIds);
                });
                allNctIds = _.uniq(allNctIds);
                $scope.cancerTypeCounts = allNctIds.length;

                var tumorTypeData = [tumorType];
                Plotly.newPlot('oncoKBtumorTypeTrials', tumorTypeData, tumorLayout, {displayModeBar: false});
                
//                var myPlot = document.getElementById("oncoKBtumorTypeTrials");
//                myPlot.on('plotly_click', function (eventData) {
//                    $scope.searchValues.tumorType = eventData.points[0].y;
//                    $scope.searchTrials();
//                });
            });

            Trials.recruitingStatusCount.get({}, function (result) {
                $scope.loadingStatusData = false;
                var layout = {barmode: 'stack'};

                var stateData = {
                    labels: ['Not yet recruiting', 'Recruiting', 'Enrolling by invitation', 'Active, not recruiting', 'Completed', 'Others'],
                    values: [result.Not_yet_recruiting, result.Recruiting, result.Enrolling_by_invitation, result.Active_not_recruiting, result.Completed, result.Others],
                    type: 'pie'
                };

                var stateTumorData = [stateData];

                Plotly.newPlot('USTrials', stateTumorData, layout);
            });

            Mappings.curationStatusCounts.get({}, function (result) {

                $scope.loadingCurationStatusData = false;
                var layout = {barmode: 'stack'};

                var curationStatusData = {
                    labels: ['Not Curated', 'In Progress', 'Completed'],
                    values: result,
                    type: 'pie'
                };

                var curationData = [curationStatusData];

                Plotly.newPlot('curationStatus', curationData, layout);
            });

        }
        plottyChart();
    }
]);
