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




// Trials controller
angular.module('trials').controller('TrialsController',
    ['$scope',
        '$stateParams',
        '$location',
        'Authentication',
        'Trials',
        'Genes',
        'Alterations',
        'Cancertypes',
        'Drugs', 'Mappings',
        function ($scope, $stateParams, $location, Authentication, Trials, Genes, Alterations, Cancertypes, Drugs, Mappings) {
            $scope.authentication = Authentication;
            $scope.nctId = '';
            $scope.drugHeader = ['Drug Name', 'Synonyms', 'FDA Approved', 'ATC Codes', 'Description'];
            $scope.drugItems = ['drugName', 'synonyms', 'fdaApproved', 'atcCodes', 'description'];
            $scope.tumorHeader = ['Name', 'Tissue', 'Clinical TrialKeywords'];
            $scope.tumorItems = ['name', 'tissue', 'clinicalTrialKeywords'];

            $scope.inclusionCriteria = '';
            $scope.exclusionCriteria = '';


            $scope.showVar = false;
            $scope.alertShow = false;
            $scope.showAll = false;
            $scope.showAllDisease = false;
            $scope.showAllDrugs = false;
            $scope.showAllCom = false;

            $scope.showAllComments = function(){
                $scope.showAllCom = !$scope.showAllCom;
            }


            $scope.switchStatus = function (status) {
                Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId}, function (u, getResponseHeaders) {
                        if(u.nctId == undefined)
                        {

                            Mappings.mappingSave.save({nctId: $scope.trial.nctId},
                                function (newMapping) {
                                    $scope.trialMappings = newMapping;

                                },
                                function (error) {
                                    console.log('did not insert successfully because of ', error);
                                }
                            );

                        }
                        else
                        {
                            u.$completeStatus({Idvalue: status},
                                function (response) {
                                    console.log('success updated');
                                    $scope.trialMappings = Mappings.mappingSearch.get({Idvalue: $stateParams.nctId});
                                }, function (response) {
                                    console.log('failed');
                                });
                        }

                    }, function (error) {
                        console.log('error: ', error);
                    }
                );

            };
            $scope.showAllTitle = function () {
                $scope.showVar = true;
            };

            $scope.showDrugs = function () {
                $scope.showAllDrugs = !$scope.showAllDrugs;
            };

            $scope.displayStyle = function () {
                $scope.showAll = !$scope.showAll;
            };
            $scope.displayDiseaseStyle = function () {
                $scope.showAllDisease = !$scope.showAllDisease;
            };

            // Create new Trial
            $scope.create = function () {
                // Create new Trial object
                var trial = new Trials({
                    nctId: this.name
                });

                // Redirect after save
                trial.$save(function (response) {
                    $location.path('trials/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Remove existing Trial
            $scope.remove = function (trial) {
                if (trial) {
                    trial.$remove();

                    for (var i in $scope.trials) {
                        if ($scope.trials [i] === trial) {
                            $scope.trials.splice(i, 1);
                        }
                    }
                } else {
                    $scope.trial.$remove(function () {
                        $location.path('trials');
                    });
                }
            };

            // Update existing Trial
            $scope.update = function () {
                var trial = $scope.trial;

                trial.$update(function () {
                    $location.path('trials/' + trial.nctId);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Find a list of Trials
            $scope.find = function () {
                $scope.trials = Trials.nctId.query();
            };


            // Find existing Trial
            $scope.findOne = function () {
                $scope.trial = Trials.nctId.get({
                    nctId: $stateParams.nctId
                },function()
                {
                    $scope.getEligibility();

                    Genes.geneList.query({}, function(a)
                    {
                        var tempGenes = [];

                         _.each(a, function(gene){
                         tempGenes.push(gene.hugo_symbol);
                         });
                         $scope.HUGOgenes = tempGenes;

                    });

                });
                var alteration_id = [];
                $scope.trialAlterations = [];
                Mappings.mappingSearch.get({
                        Idvalue: $stateParams.nctId,
                    },
                    function (a) {
                        var tempArr1 = [];
                        if (a.alteration.length > 0) {
                            for (var i = 0; i < a.alteration.length; i++) {
                                alteration_id.push(a.alteration[i].alteration_Id);
                            }
                            Alterations.alterationByIds.query({Ids: alteration_id},
                                function(res){
                                    _.each(res, function(item){
                                        var index = _.map(a.alteration, function(e){return e.alteration_Id}).indexOf(item._id);

                                        $scope.trialAlterations.push({gene: item.gene, alteration: item.alteration, status: a.alteration[index].status});
                                    });
                                    // console.log('here is the alteration infor1 ', tempArr1);

                                }
                            );
                        }
                        else {
                            $scope.trialAlterations = [];
                            console.log('no alteration information for this trial ID')
                        }
                        if (a.predictedGenes.length > 0) {

                            _.each(a.predictedGenes, function(item){
                                $scope.trialAlterations.push({gene: item, alteration: 'unspecified', status: 'predicted'});
                            });
                        }
                        //console.log('here is the alteration infor2 ', $scope.trialAlterations, $scope.trialAlterations.length);

                    },
                    function (b) {
                        $scope.trialAlterations = [];
                        console.log('no alteration information for this trial ID')
                    });


                $scope.trialMappings = Mappings.mappingSearch.get({Idvalue: $stateParams.nctId}, function()
                    {
                        if($scope.trialMappings.completeStatus === undefined)
                        {
                            $scope.trialStatus = 1;
                        }
                        else
                        {
                            $scope.trialStatus = $scope.trialMappings.completeStatus;
                        }
                        if($scope.trialMappings.comments === undefined)
                        {
                            $scope.trialComments = [];
                        }
                        else
                        {
                            $scope.trialComments = $scope.trialMappings.comments;
                        }

                    },
                    function()
                    {

                    });
            };

            $scope.searchByKeyword = function () {
                $scope.trials = Trials.keyword.query({
                    keyword: $scope.keyword
                });
            };

            $scope.searchTrailBynctId = function () {
                $location.path('trials/' + $scope.nctId);
            };

            $scope.assignTrailBynctId = function () {
                $scope.trial = Trials.nctId.get({
                    nctId: $scope.nctId
                });
                $scope.trialGenes = Genes.nctIds.get({
                    nctIds: [$scope.nctId]
                });
                console.log($scope.trialGenes);
            };

            $scope.getDrugs = function (drugs) {
                return drugs.map(function (e) {
                    return e.drugName;
                }).join(', ');
            };

            var getLists = function (str) {
                var slicedResult = [];

                if ((str.indexOf('1. ') !== -1 && (str.indexOf('1. ') < str.indexOf(' - ') || str.indexOf(' - ') === -1))) {
                    slicedResult = str.replace(/(\d)[.]\s/g, '\u000B').split('\u000B');
                    slicedResult = _.map(slicedResult, function (value) {
                        return value.slice(0, -1).trim();
                    });
                    slicedResult = _.compact(slicedResult);

                }
                else {
                    slicedResult = str.split(' - ');
                    slicedResult = _.map(slicedResult, function (value) {
                        return value.trim();
                    });
                    slicedResult = _.compact(slicedResult);
                    //slicedResult = ["pear","watermelon","orange"];
                }

                slicedResult = _.map(slicedResult, function (element) {
                    return element.split('. ');
                });
                slicedResult = _.flatten(slicedResult);
                return slicedResult;
            };

            $scope.getEligibility = function () {
                var eligibility = $scope.trial.eligibilityCriteria;
                //var eleArr = eligibility.split("\n\n");
                //var eleArr = eligibility.split("\r\n");
                var eleArr = eligibility.split(/\r?\n | \n\n | \n/);
                var tempArr = [];
                _.each(eleArr, function(item){
                    tempArr.push(item.trim());
                });
                $scope.criteria = tempArr;
/*
                var m = eligibility.indexOf('Inclusion Criteria');
                var n = eligibility.indexOf('Exclusion Criteria');
                if(m !== -1 && n !== -1)
                {
                    m += 20;
                    n += 20;

                    var output = '<ol>';

                    var inEligi = eligibility.substr(m, n - m - 20);
                    var inEligiArray = getLists(inEligi);

                    _.each(inEligiArray, function (element) {
                        output = output + '<li>' + element + '</li>';
                    });
                    output += '</ol>';
                    $scope.inclusionCriteria = output;

                    var exEligi = eligibility.substr(n);
                    var exEligiArray = getLists(exEligi);
                    _.each(exEligiArray, function (element) {
                        output = output + '<li>' + element + '</li>';
                    });
                    output += '</ol>';
                    $scope.exclusionCriteria = output;
                }
*/
             //   console.log('here  ', $scope.inclusionCriteria.length);


            };
            //Add new connection between alterations and current trial
            $scope.addAlterationBynctId = function () {
                Alterations.alteration.get({
                    alteration: $scope.newAlteration.toUpperCase(),
                    gene: $scope.newGene.toUpperCase()
                }, function (u, getResponseHeaders) {

                    if (u._id) {

                        console.log('alteration existed...');
                        Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId},
                            function (a) {
                                if (a._id) {
                                    console.log('nctId record exist in mapping table...', a);
                                    Mappings.mapping.get({alteration: u._id, nctId: $scope.trial.nctId},
                                        function (mapRecord) {
                                            if (mapRecord._id) {
                                                console.log('nothing else need to do', mapRecord);
                                            } else {
                                                console.log('update alteration array');
                                                a.$update({Idvalue: u._id},
                                                    function () {
                                                        console.log('successfully update alteration array');
                                                        $scope.trialAlterations.push({
                                                            alteration: $scope.newAlteration.toUpperCase(),
                                                            gene: $scope.newGene.toUpperCase()
                                                        });
                                                    },
                                                    function () {
                                                        console.log('update alteration array failed');
                                                    }
                                                );
                                            }
                                        },
                                        function () {

                                        }
                                    );
                                } else {
                                    //insert new mapping record
                                    console.log('nctId record not exist in mapping table...');

                                    Mappings.mapping.save({alteration: u._id, nctId: $scope.trial.nctId},
                                        function () {
                                            console.log('success insert record in mapping table');
                                            //$scope.trialAlterations = findAlterations($scope.trial.nctId);
                                            $scope.trialAlterations.push({
                                                alteration: $scope.newAlteration.toUpperCase(),
                                                gene: $scope.newGene.toUpperCase(),
                                                status: 'manually'
                                            });
                                        },
                                        function (error) {
                                            console.log('did not insert successfully because of ', error);
                                        }
                                    );
                                }

                            },
                            function (b) {


                            }
                        );

                    } else {
                        Alterations.alteration.save({alteration: $scope.newAlteration, gene: $scope.newGene},
                            function (u, getResponseHeaders) {
                                console.log('save alteration successfully');
                                //search mapping record by nctId
                                //also need to check if nctId record already exist or not like the above block
                                Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId},
                                    function (a) {
                                        if (a._id) {
                                            console.log('nctId record exist in mapping table...', a);
                                            Mappings.mapping.get({alteration: u._id, nctId: $scope.trial.nctId},
                                                function (mapRecord) {
                                                    if (mapRecord._id) {
                                                        console.log('nothing else need to do', mapRecord);
                                                    } else {
                                                        console.log('update alteration array');
                                                        a.$update({Idvalue: u._id},
                                                            function () {
                                                                console.log('successfully update alteration array');
                                                                //$scope.trialAlterations = findAlterations($scope.trial.nctId);
                                                                $scope.trialAlterations.push({
                                                                    alteration: $scope.newAlteration.toUpperCase(),
                                                                    gene: $scope.newGene.toUpperCase(),
                                                                    status: 'manually'
                                                                });
                                                            },
                                                            function () {
                                                                console.log('update alteration array failed');
                                                            }
                                                        );
                                                    }
                                                },
                                                function () {

                                                }
                                            );
                                        } else {
                                            //insert new mapping record
                                            console.log('nctId record not exist in mapping table...');

                                            Mappings.mapping.save({alteration: u._id, nctId: $scope.trial.nctId},
                                                function () {
                                                    console.log('success insert record in mapping table');
                                                   // $scope.trialAlterations = findAlterations($scope.trial.nctId);
                                                    $scope.trialAlterations.push({
                                                        alteration: $scope.newAlteration.toUpperCase(),
                                                        gene: $scope.newGene.toUpperCase(),
                                                        status: 'manually'
                                                    });
                                                },
                                                function (error) {
                                                    console.log('did not insert successfully because of ', error);
                                                }
                                            );
                                        }
                                    },
                                    function (b) {


                                    }
                                );


                            }, function () {
                                console.log('failed to save alteration ');
                            }
                        );
                    }

                }, function (getError) {
                    // the alteration didn't exist, so insert to both alteration and mapping, and update trial alteration information

                    console.log('alteration did not exist');


                });


            };

            $scope.deleteAlteration = function (alteration, gene) {
                Alterations.alteration.get({alteration: alteration, gene: gene},
                    function (a) {
                        console.log('find this alteration');
                        Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId},
                            function (c) {

                                c.$deleteAlt({Idvalue: a._id},
                                    function (e) {
                                        console.log('delete successfully');
                                        for (var i = 0; i < $scope.trialAlterations.length; i++) {
                                            var alterationItem = $scope.trialAlterations[i];
                                            if (alterationItem.alteration == alteration.toUpperCase() && alterationItem.gene == gene.toUpperCase()) {
                                                $scope.trialAlterations.splice(i, 1);
                                            }
                                        }

                                    },
                                    function (f) {
                                        console.log('delete failed', f);
                                    }
                                );
                            },
                            function (d) {
                                console.log('not find mapping record');
                            }
                        )
                    },
                    function (b) {
                        console.log('not find this alteration');
                    }
                )
            };

            $scope.updateTrial = function () {

                Trials.updateRequestedTrial.get({requestednctId: $scope.trial.nctId}, function (u, getResponseHeaders) {

                        u.$update(function (response) {
                            $scope.trial = Trials.nctId.get({
                                nctId: $stateParams.nctId
                            });
                            console.log('success updated');
                        }, function (response) {
                            console.log('failed');
                        });
                    }, function (error) {
                        console.log('error: ', error);
                    }
                );


            };


            $scope.saveComments = function() {
                if($scope.comment === undefined)
                {
                    bootbox.alert('write some comments before save it!');
                    return false;
                }
                Mappings.commentsSave.commentsSave({trialID: $scope.trial.nctId,comment: $scope.comment},
                function(){
                    $scope.trialComments.push($scope.comment);
                    console.log('successfully saved');
                    $scope.comment = '';
                    $scope.showAllCom = true;

                },
                function(){
                    console.log('failed to save ');
                });
            }

        }
    ]);
