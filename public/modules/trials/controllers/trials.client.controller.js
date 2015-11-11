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

            $scope.criteriaTitles = ['Inclusion Criteria:', 'Exclusion Criteria:', 'DISEASE CHARACTERISTICS:', 'PATIENT CHARACTERISTICS:', 'PRIOR CONCURRENT THERAPY:'];


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

                        if(a.nctId !== undefined)
                        {
                            if (a.alteration.length > 0) {


                                for (var i = 0; i < a.alteration.length; i++) {
                                    alteration_id.push(a.alteration[i].alteration_Id);
                                }
                                Alterations.alterationByIds.query({Ids: alteration_id},
                                    function(res){
                                        _.each(res, function(item){
                                            var index = _.map(a.alteration, function(e){return e.alteration_Id}).indexOf(item._id);
                                            $scope.trialAlterations.push({alteration_Id: a.alteration[index].alteration_Id, gene: item.gene, alteration: item.alteration, status: a.alteration[index].status, confirmStatus: a.alteration[index].confirmStatus});
                                        });

                                    }
                                );
                            }
                            else {
                                $scope.trialAlterations = [];
                                console.log('no alteration information for this trial ID')
                            }
                            if (a.predictedGenes.length > 0) {

                                _.each(a.predictedGenes, function(item){
                                    $scope.trialAlterations.push({gene: item.gene, alteration: 'unspecified', status: 'predicted', confirmStatus: item.confirmStatus});
                                });
                            }
                        }
                        else
                        {
                            $scope.trialAlterations = [];
                            console.log('There is no mapping record existed for this trial.');
                        }


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

            };
            //Add new connection between alterations and current trial
            $scope.addAlterationBynctId = function () {
                var addFalg = true;
                _.each($scope.trialAlterations, function(item){
                    if($scope.newAlteration.toUpperCase() === item.alteration && $scope.newGene.toUpperCase() === item.gene)
                    {
                        bootbox.alert('Sorry but entered alteration already added for this trial!');
                        addFalg = false;
                    }
                });
                if(addFalg)
                {
                    Alterations.addAlteration.get({
                        alteration: $scope.newAlteration.toUpperCase(),
                        gene: $scope.newGene.toUpperCase(),
                        nctId: $scope.trial.nctId
                    }, function (u) {
                        if(u[1] === 'e'){
                            bootbox.alert('Sorry but error happened when inserting the record. Please try again');
                            console.log('Internal error happened');
                        }
                        else if(u[1] === 'a'){
                            console.log('Entered the alteration record already existed. Mapping record does not exist. ');
                            console.log('Inserted new mapping record');
                        }
                        else if(u[1] === 'b'){
                            console.log('Entered the alteration record already existed. Mapping record also already existed.');
                            console.log('Updated the mapping table');
                        }
                        else if(u[1] === 'c'){
                            console.log('Entered the alteration record does not exist. Mapping record does not exist either. ');
                            console.log('Inserted new alteration record and mapping record');
                        }
                        else if(u[1] === 'd'){
                            console.log('Entered the alteration record does not exist. Mapping record already existed. ');
                            console.log('Inserted new alteration record and updated the mapping table');
                        }

                        if(u[1] !== 'e'){
                            $scope.trialAlterations.push({ alteration: $scope.newAlteration.toUpperCase(),
                                gene: $scope.newGene.toUpperCase(),
                                status : "manually"
                            });
                        }


                    });
                }


            };

            $scope.deleteAlteration = function (x) {
                if(x.alteration_Id === undefined)
                {
                    Mappings.deleteGene.get({trialID: $scope.trial.nctId, gene: x.gene},function(a){
                        var tempArr = $scope.trialAlterations;
                        for (var i = 0; i < tempArr.length; i++) {
                            if (tempArr[i].gene === x.gene) {
                                $scope.trialAlterations.splice(i, 1);
                                break;
                            }
                        }

                    });
                }
                else
                {   console.log(x.alteration_Id);
                    Mappings.deleteAlteration.get({trialID: $scope.trial.nctId, alteration_Id: x.alteration_Id},function(a){
                        var tempArr = $scope.trialAlterations;
                        for (var i = 0; i < tempArr.length; i++) {
                            if (tempArr[i].alteration_Id === x.alteration_Id) {
                                $scope.trialAlterations.splice(i, 1);
                                break;
                            }
                        }

                    });

                }

            };

            $scope.confirmAlteration = function(x){
                if(x.alteration_Id === undefined)
                {
                    var gene = x.gene;
                    Mappings.confirmGene.get({trialID: $scope.trial.nctId, gene: gene},
                        function (a) {
                            _.each($scope.trialAlterations, function(item){
                                if(item.gene === gene)
                                {
                                    item.confirmStatus = 'confirmed';
                                }
                            });

                        }
                    );
                }
                else
                {
                    Mappings.confirmAlteration.get({trialID: $scope.trial.nctId, alteration_Id: x.alteration_Id},
                        function (a) {
                            _.each($scope.trialAlterations, function(item){
                                if(item.alteration_Id === x.alteration_Id)
                                {
                                    item.confirmStatus = 'confirmed';
                                }
                            });

                        }
                    );
                 }

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
