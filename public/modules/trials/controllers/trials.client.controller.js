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
            $scope.inclusion_editing = false;
            $scope.exclusion_editing = false;

            $scope.geneAliasOperation = false;
            $scope.addGeneAlias = false;
            $scope.saveGeneAlias = false;
            $scope.delGeneAlias = false;
            $scope.showNewAlias = false;
            $scope.skipItemOperation = false;
            $scope.addSkipItem = false;
            $scope.saveSkipItem = false;
            $scope.delSkipItem = false;
            $scope.showNewSkipItem = false;
            $scope.countNum = 10;



            String.prototype.capitalize = function() {
                return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
            };

            var editingAlteration = {};

            $scope.showAllComments = function(){
                $scope.showAllCom = !$scope.showAllCom;
            };
            $scope.showAllLogs = function(){
                $scope.showAlllog = !$scope.showAlllog;
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
                var trialsLength = 0;
                Trials.nctId.query({},function(result){
                    $scope.trials = result;
                    trialsLength = result.length;

                });


                $(window).scroll(function() {
                    if($(window).scrollTop() + $(window).height() == $(document).height()) {
                        $scope.$apply(function(){
                            if($scope.countNum < trialsLength){
                                $scope.countNum += 10;
                            }

                        })

                    }
                });

            };


            function fetchCancertypeInfo(nctId){
                var tempArr1 = [], tempArr2 = [];
                Cancertypes.cancerTypeInfo.get({nctId: nctId},function(result){

                    _.each(result, function(item){
                        tempArr1.push(item.cancer);

                    });
                    $scope.cancers = tempArr1;
                    console.log(tempArr1);
                });
            }


            function fetchMapInfo(){

                $scope.inclusionAlterations = [];
                $scope.exclusionAlterations = [];
                $scope.logs = [];

                Mappings.mappingSearch.get({
                        Idvalue: $stateParams.nctId,
                    },
                    function (a) {
                        if(a.nctId !== undefined)
                        {
                            var temArr1 = [], temArr2 = [];
                            _.each(a.alterations, function(item){

                                if(item.type === 'inclusion')
                                {
                                    temArr1.push(item);
                                }
                                else if(item.type === 'exclusion')
                                {
                                    temArr2.push(item);
                                }
                            });
                            $scope.inclusionAlterations = temArr1;
                            $scope.exclusionAlterations = temArr2;
                            $scope.trialStatus = a.completeStatus;

                            if (a.log.length > 0)
                            {

                                Mappings.convertLog.get({
                                    trialID: $stateParams.nctId,
                                }, function(convertedLogs){

                                    var tempArr = [], tempStr = '';
                                    _.each(convertedLogs, function(item){
                                        if(item.changetoStatus !== undefined)
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
                                        else if(item.operationType === 'confirm' || item.operationType === 'add')
                                        {
                                            tempStr = item.user + ' ' + item.operationType + 'ed ' + item.gene + ' ' + item.alteration + ' at ' + item.date;
                                        }
                                        else if(item.operationType === 'delete')
                                        {
                                            tempStr = item.user + ' deleted ' + item.gene + ' ' + item.alteration + ' at ' + item.date;
                                        }
                                        tempArr.push(tempStr);
                                    });
                                    $scope.logs = tempArr;

                                    if($scope.logs.length > 3)
                                    {
                                        $scope.showAlllog = true;
                                    }
                                    else
                                    {
                                        $scope.showAlllog = false;
                                    }

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
                    fetchCancertypeInfo($stateParams.nctId);
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
                    $scope.trial.drugs = _.uniq($scope.trial.drugs);

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
            $scope.addAlterationBynctId = function (type) {

                var addFalg = true;
                var tempAlteration = '', tempGene = '', tempArr = [];
                if(type === 'inclusion'){
                    tempAlteration = $scope.inclusion_newAlteration;
                    tempGene = $scope.inclusion_newGene;
                    tempArr = $scope.inclusionAlterations;
                }
                else if(type === 'exclusion'){
                    tempAlteration = $scope.exclusion_newAlteration;
                    tempGene = $scope.exclusion_newGene;
                    tempArr = $scope.exclusionAlterations;
                }
                _.each(tempArr, function(item){
                    if(tempAlteration.toUpperCase() === item.alteration && tempGene.toUpperCase() === item.gene)
                    {
                        bootbox.alert('Sorry but entered alteration already added for this trial!');
                        addFalg = false;
                    }
                });
                if(addFalg)
                {
                    Alterations.addAlteration.get({
                        alteration: tempAlteration.toUpperCase(),
                        gene: tempGene.toUpperCase(),
                        nctId: $scope.trial.nctId,
                        type: type
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

                            fetchMapInfo();
                        }


                    });

                }


            };

            $scope.deleteAlteration = function (x) {

                Mappings.deleteAlteration.get({trialID: $scope.trial.nctId, alteration: x.alteration, gene: x.gene, type: x.type},function(a){

                    fetchMapInfo();

                });

            };

            $scope.editAlteration = function (x, type) {
                editingAlteration = x;
                if(type === 'inclusion')
                {
                    $scope.inclusion_editing = true;
                    $scope.inclusion_editedGene = x.gene;
                    $scope.inclusion_editedMutation = x.alteration;
                }
                else if(type === 'exclusion')
                {
                    $scope.exclusion_editing = true;
                    $scope.exclusion_editedGene = x.gene;
                    $scope.exclusion_editedMutation = x.alteration;
                }
            };
            $scope.saveAlteration = function(tempGene, tempAlteration, type){

                if( tempGene === editingAlteration.gene && tempAlteration === editingAlteration.alteration)
                {
                    bootbox.alert('Please edit mutation record before save it!');
                    return false;
                }
                else
                {
                    Mappings.deleteAlteration.get({trialID: $scope.trial.nctId, alteration: editingAlteration.alteration, gene: editingAlteration.gene, type: editingAlteration.type},function(a){

                    });
                    //insert new alteration record to the alteration table
                    if(type === 'inclusion'){
                        $scope.inclusion_newAlteration = tempAlteration;
                        $scope.inclusion_newGene =  tempGene;

                        $scope.inclusion_editedGene = '';
                        $scope.inclusion_editedMutation = '';
                    }
                    else if(type === 'exclusion'){
                        $scope.exclusion_newAlteration = tempAlteration;
                        $scope.exclusion_newGene = tempGene;

                        $scope.exclusion_editedGene = '';
                        $scope.exclusion_editedMutation = '';

                    }
                    $scope.addAlterationBynctId(type);

                }

                $scope.editing = false;

            };

            $scope.confirmAlteration = function(x){

                Mappings.confirmAlteration.get({trialID: $scope.trial.nctId, alteration: x.alteration, gene: x.gene, type: x.type},
                    function (a) {
                        fetchMapInfo();
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
                inputText = " " + inputText;
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

            $scope.rulesInitiation = function(){

                Genes.getAlias.get({},function(result){

                    $scope.geneAlias = result;
                });
                Genes.getskipItems.get({},function(result){

                    $scope.skipItems = result;
                });
            }

            $scope.addRule = function(type, value){
                if(type === 'alias'){
                    $scope.geneAliasOperation = true;
                    $scope.addGeneAlias = true;
                    $scope.saveGeneAlias = false;
                    $scope.delGeneAlias = false;
                    $scope.showNewAlias = false;
                    $scope.aliasGene = value;
                    $scope.newAlias = '';
                }
                else if(type === 'skip'){
                    $scope.skipItemOperation = true;
                    $scope.addSkipItem = true;
                    $scope.saveSkipItem = false;
                    $scope.delSkipItem = false;
                    $scope.showNewSkipItem = true;
                    $scope.skipItem = false;
                    $scope.newSkipItem = '';
                }

            }
            $scope.deleteRule = function(type, value){
                if(type === 'alias'){
                    $scope.geneAliasOperation = true;
                    $scope.delGeneAlias = true;
                    $scope.addGeneAlias = false;
                    $scope.saveGeneAlias = false;
                    $scope.showNewAlias = false;
                    $scope.aliasGene = value;
                    $scope.newAlias = '';
                }
                else if(type === 'skip'){
                    $scope.skipItemOperation = false;
                    $scope.oriSkipItem = value;
                    $scope.assignRule('skip', 'delete');
                }

            }
            $scope.editRule = function(type, value){
                if(type === 'alias'){
                    $scope.geneAliasOperation = true;
                    $scope.addGeneAlias = false;
                    $scope.delGeneAlias = false;
                    $scope.showNewAlias = true;
                    $scope.saveGeneAlias = true;
                    $scope.aliasGene = value;
                }
                else if(type === 'skip'){
                    $scope.skipItemOperation = true;
                    $scope.saveSkipItem = true;
                    $scope.addSkipItem = false;
                    $scope.delSkipItem = false;
                    $scope.skipItem = true;
                    $scope.showNewSkipItem = true;
                    $scope.oriSkipItem = value;
                    $scope.newSkipItem = '';
                }

            }

            $scope.assignRule = function(type, operation){

                var tempStr;
                if(type === 'alias'){
                    if(operation === 'edit'){
                        tempStr = $scope.aliasGene + ',' + $scope.alias + ',' + $scope.newAlias;
                        $scope.newAlias = '';
                        $scope.geneAliasOperation = false;
                    }else{
                        tempStr = $scope.aliasGene + ',' + $scope.alias;
                        $scope.alias = '';
                        $scope.geneAliasOperation = false;
                    }
                }else if(type === 'skip'){
                    if(operation === 'edit'){
                        tempStr = $scope.oriSkipItem + ',' + $scope.newSkipItem;
                        $scope.skipItemOperation = false;

                    }else if(operation === 'add'){
                        tempStr = $scope.newSkipItem;
                        $scope.skipItemOperation = false;

                    }else if(operation === 'delete'){
                        tempStr = $scope.oriSkipItem;
                    }

                }
                Genes.assignRule.get({type: type, operation: operation, values: tempStr}, function(result){
                    $scope.rulesInitiation();
                });

            }


        }
    ]);
