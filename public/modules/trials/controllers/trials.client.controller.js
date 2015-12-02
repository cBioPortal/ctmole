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
        'Drugs', 'Mappings', 'Users',
        function ($scope, $stateParams, $location, Authentication, Trials, Genes, Alterations, Cancertypes, Drugs, Mappings, Users) {
            $scope.authentication = Authentication;
            $scope.nctId = '';
            $scope.drugHeader = ['Drug Name', 'Synonyms', 'FDA Approved', 'ATC Codes', 'Description'];
            $scope.drugItems = ['drugName', 'synonyms', 'fdaApproved', 'atcCodes', 'description'];
            $scope.tumorHeader = ['Name', 'Tissue', 'Clinical TrialKeywords'];
            $scope.tumorItems = ['name', 'tissue', 'clinicalTrialKeywords'];

            $scope.criteriaTitles = ['Inclusion Criteria:', 'Exclusion Criteria:', 'DISEASE CHARACTERISTICS:', 'PATIENT CHARACTERISTICS:', 'PRIOR CONCURRENT THERAPY:',
                '-  INCLUSION CRITERIA:', 'EXCLUSION CRITERIA:'];


            $scope.showVar = false;
            $scope.alertShow = false;
            $scope.showAll = false;
            $scope.showAllDisease = false;
            $scope.showAllDrugs = false;
            $scope.showAllCom = false;
            $scope.editing = false;

            var editingAlteration = {};

            $scope.showAllComments = function(){
                $scope.showAllCom = !$scope.showAllCom;
            };


            $scope.switchStatus = function (status) {
                Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId}, function (u, getResponseHeaders) {
                        if(u.nctId === undefined)
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

                        fetchMapInfo();

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




            function fetchMapInfo(){
                var alteration_id = [];
                $scope.trialAlterations = [];
                $scope.logs = [];

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
                                            var index = _.map(a.alteration, function(e){return e.alteration_Id;}).indexOf(item._id);
                                            $scope.trialAlterations.push({alteration_Id: a.alteration[index].alteration_Id, gene: item.gene, alteration: item.alteration, status: a.alteration[index].status, confirmStatus: a.alteration[index].confirmStatus});
                                        });

                                    }
                                );
                            }


                            if (a.predictedGenes.length > 0) {

                                _.each(a.predictedGenes, function(item){
                                    if(item.confirmStatus !== 'confirmed')
                                    {
                                        $scope.trialAlterations.push({gene: item.gene, alteration: 'unspecified', status: 'predicted', confirmStatus: item.confirmStatus});
                                    }
                                });
                            }

                            if($scope.trialAlterations.length === 0) {
                                console.log('no alteration information for this trial ID');
                            }
                            if (a.log.length > 0)
                            {

                                Mappings.convertLog.get({
                                    trialID: $stateParams.nctId,
                                }, function(convertedLogs){
                                    var tempArr = [], tempStr = '';
                                    _.each(convertedLogs, function(item){
                                        if(item.alteration !== undefined)
                                        {
                                            if(item.operationType === 'confirmAlteration')
                                            {
                                                tempStr = item.user + ' confirmed ' + item.alteration.gene + ' ' + item.alteration.alteration + ' at ' + item.date;
                                            }
                                            else if(item.operationType === 'add')
                                            {
                                                tempStr = item.user + ' added ' + item.alteration.gene + ' ' + item.alteration.alteration + ' at ' + item.date;
                                            }
                                            else if(item.operationType === 'delete')
                                            {
                                                tempStr = item.user + ' deleted ' + item.alteration.gene + ' ' + item.alteration.alteration + ' at ' + item.date;
                                            }
                                            else
                                            {
                                                tempStr = item.user + ' ' + item.operationType + ' ' + item.alteration.gene + ' ' + item.alteration.alteration + ' at ' + item.date;
                                            }
                                        }
                                        else if(item.changetoStatus !== undefined)
                                        {
                                            var tempValue = '';
                                            if(item.changetoStatus === '1')
                                            {
                                                tempValue = 'Not Curated';
                                            }
                                            else if(item.changetoStatus === '2')
                                            {
                                                tempValue = 'Curating';
                                            }
                                            else if(item.changetoStatus === '3')
                                            {
                                                tempValue = 'Curated';
                                            }
                                            tempStr = item.user + ' changed status to ' + tempValue + ' at ' + item.date;
                                        }
                                        else if(item.operationType === 'confirmGene')
                                        {
                                            tempStr = item.user + ' confirmed ' + item.gene + ' at ' + item.date;
                                        }
                                        else if(item.gene !== undefined)
                                        {
                                            tempStr = item.user + ' deleted ' + item.gene + ' at ' + item.date;
                                        }
                                        tempArr.push(tempStr);
                                    });
                                    $scope.logs = tempArr;
                                });
                            }
                            else
                            {
                                $scope.logs = ['No curation history available'];
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
                        console.log('no alteration information for this trial ID');
                    });
            }

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

                    fetchMapInfo();
                    $scope.trialStatus = '1';
                    $scope.trialMappings = Mappings.mappingSearch.get({Idvalue: $stateParams.nctId}, function()
                    {
                        if($scope.trialMappings.completeStatus === undefined)
                        {
                            $scope.trialStatus = '1';
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

                            if($scope.trialStatus !== '2')
                            {   console.log('here it is ');
                                $scope.switchStatus('2');
                                $scope.trialStatus = '2';
                            }
                            else
                            {
                                fetchMapInfo();
                            }
                        }


                    });

                }


            };

            $scope.deleteAlteration = function (x) {
                if($scope.trialStatus !== '2')
                {
                    $scope.switchStatus('2');
                    $scope.trialStatus = '2';
                }

                if(x.alteration_Id === undefined)
                {
                    Mappings.deleteGene.get({trialID: $scope.trial.nctId, gene: x.gene},function(a){

                        fetchMapInfo();

                    });
                }
                else
                {
                    Mappings.deleteAlteration.get({trialID: $scope.trial.nctId, alteration_Id: x.alteration_Id},function(a){

                        fetchMapInfo();

                    });

                }

            };

            $scope.editAlteration = function (x) {


                $scope.editedGene = x.gene;
                $scope.editedMutation = x.alteration;
                $scope.editing = true;
                editingAlteration = x;
                console.log(editingAlteration.alteration_Id);
            };
            $scope.saveAlteration = function(newGene, newAlteration){

                if( newGene === editingAlteration.gene && newAlteration === editingAlteration.alteration)
                {
                    bootbox.alert('Please edit mutation record before save it!');
                    return false;
                }
                else
                {
                    if(editingAlteration.alteration_Id !== undefined)
                    {
                        //remove old alteration id from the mapping table
                        Mappings.deleteAlteration.get({trialID: $scope.trial.nctId, alteration_Id: editingAlteration.alteration_Id},function(a){

                        });
                    }
                    else
                    {
                        //confirm gene in the mapping table
                        Mappings.confirmGene.get({trialID: $scope.trial.nctId, gene: editingAlteration.gene},
                                function (a) {
                                }
                            );
                    }
                    //insert new alteration record to the alteration table
                    $scope.newGene = newGene;
                    $scope.newAlteration = newAlteration;
                    $scope.addAlterationBynctId();

                }

                $scope.editing = false;

            };

            $scope.confirmAlteration = function(x){

                Mappings.confirmAlteration.get({trialID: $scope.trial.nctId, alteration_Id: x.alteration_Id},
                    function (a) {
                        if($scope.trialStatus !== '2')
                        {
                            $scope.switchStatus('2');
                            $scope.trialStatus = '2';
                        }
                        else
                        {
                            fetchMapInfo();
                        }

                    }
                );



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
                if($scope.trialStatus !== '2')
                {
                    $scope.switchStatus('2');
                    $scope.trialStatus = '2';
                }

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
            };

            function highLightSearch(inputText, elementIDs){
                if(typeof elementIDs === 'string')
                {
                    elementIDs = [elementIDs];
                }

                _.each(elementIDs, function(elementID){
                    var searchEle = document.getElementById(elementID);
                    if(searchEle !== null)
                    {
                        var innerHTML = searchEle.innerHTML.toLowerCase();

                        var regex = new RegExp(inputText, "gi"), result, indices = [], tempStr;
                        while ( (result = regex.exec(innerHTML)) ) {
                            indices.push(result.index);
                        }
                        if(indices.length > 0)
                        {
                            tempStr = innerHTML.substring(0,indices[0]);
                            var tempIndex = indices.length-1;
                            for(var i = 0; i < tempIndex;i++)
                            {
                                tempStr += "<span class='highlight'>" + innerHTML.substring(indices[i],indices[i]+inputText.length) + "</span>"
                                    + innerHTML.substring(indices[i]+inputText.length,indices[i+1]);
                            }

                            tempStr += "<span class='highlight'>" + innerHTML.substring(indices[tempIndex],indices[tempIndex]+inputText.length) + "</span>"
                                + innerHTML.substring(indices[tempIndex]+inputText.length);

                            searchEle.innerHTML = tempStr;
                        }

                    }
                });

            }

            function cancelHighlight(elementIDs){
                if(typeof elementIDs === 'string')
                {
                    elementIDs = [elementIDs];
                }

                _.each(elementIDs, function(elementID){
                    var searchEle = document.getElementById(elementID);
                    if(searchEle !== null){
                        var innerHTML = searchEle.innerHTML;
                        searchEle.innerHTML = innerHTML.replace(/<span class=\"highlight\">|<\/span>/gi, '');
                    }
                });

            }

            $scope.highlight = function(gene, alteration){

                cancelHighlight(['armTable', 'title', 'purpose', 'criteria']);

                var inputText = gene.toLowerCase();

                highLightSearch(inputText, ['armTable','title','purpose','criteria']);

                if(alteration !== 'unspecified')
                {
                    inputText = alteration.toLowerCase();
                    highLightSearch(inputText, ['armTable','title','purpose','criteria']);
                }


            }

            $scope.excludeAlteration = function(x){
                if($scope.trialStatus !== '2')
                {
                    $scope.switchStatus('2');
                    $scope.trialStatus = '2';
                }

                Mappings.excludeGene.get({trialID: $scope.trial.nctId, gene: x.gene},
                    function (a) {
                        _.each($scope.trialAlterations, function(item){
                            if(item.gene === x.gene && item.alteration === x.alteration)
                            {
                                item.confirmStatus = 'excluded';
                            }
                        });

                    }
                );
            }


        }
    ]);
