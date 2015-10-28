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


angular.module('core').controller('HomeController', ['$scope', '$location', '$rootScope','Authentication', 'Trials', 'Mappings', 'Alterations',
    function ($scope, $location, $rootScope, Authentication, Trials, Mappings, Alterations) {

        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.loading = false;
        $scope.showResult = false;
        $scope.showRefine = false;
        $scope.allCountries = true;
        $scope.firstSearch = true;
        $scope.refineFlag = false;

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



    function endSearch() {
            $scope.loading = false;
            $scope.showResult = true;
            $scope.showRefine = true;

        }

        function compare(a, b) {
            if (a.gene < b.gene)
                return -1;
            if (a.gene > b.gene)
                return 1;
            return 0;
        }

        /*
        $scope.showAllCountries = function () {
            $scope.allCountries = true;
            _.each($scope.criteria, function (criterion) {
                if (criterion.type == 'country') {
                    criterion.value = ['United States'];
                }
            });

        }
        $scope.hideAllCountries = function () {
            $scope.allCountries = false;
            _.each($scope.criteria, function (criterion) {
                if (criterion.type == 'country') {
                    criterion.value = ['United States'];
                }
            });

            $location.search('country', ['United States']);
        }
*/


        //search in the mapping table
        function searchMappingByStatus() {

            Mappings.searchByStatus.query({
                    status: '3'
                },
                function (data) {
                    if (data.length > 0) {
                        var tempcomTrialIds = [];
                        for (var i = 0; i < data.length; i++) {
                            tempcomTrialIds.push(data[i].nctId);
                        }
                        $scope.comTrialIds = tempcomTrialIds;
                    }
                },
                function (error) {
                    console.log('No hits in the mapping table');
                }
            );


            Mappings.searchByStatus.query({
                    status: '2'
                },
                function (data) {
                    if (data.length > 0) {
                        var tempcomTrialIds = [];
                        for (var i = 0; i < data.length; i++) {
                            tempcomTrialIds.push(data[i].nctId);
                        }
                        $scope.inComTrialIds = tempcomTrialIds;
                    }
                },
                function (error) {
                    console.log('No hits in the mapping table');
                }
            );
        }
        $scope.search = function (searchStr) {
            var searchKeyword = $scope.searchKeyword;
            if (searchKeyword === undefined) {
                bootbox.alert('please input keyword to start search!');
                return false;
            }

            $scope.loading = true;
            $scope.showResult = false;
            $scope.showRefine = false;

            $scope.countries = [];
            $scope.genes = [];
            $scope.mutations = [];
            $scope.mutationIDs = [];
            $scope.tumorTypes = [];
            $scope.country = ['United States'];

            //search in the trial table
            Trials.searchEngine.query({searchEngineKeyword: searchKeyword}, function (data) {

                    if (data.length == 0) {
                        bootbox.alert('Sorry no result found! Please change your input to restart search');
                        $scope.searchKeyword = '';
                        $scope.loading = false;
                        return false;
                    }
                    else {

                        for (var i = 0; i < data.length; i++) {
                            $scope.countries = $scope.countries.concat(data[i].countries);
                            $scope.trialsNctIds.push(data[i].nctId);
                            _.each(data[i].tumorTypes, function (tumorItem) {
                                $scope.tumorTypes.push(tumorItem.tumorTypeId);
                            });
                            _.each(data[i].alterationsFetched, function (value) {

                                if ($scope.mutationIDs.indexOf(value._id) == -1) {
                                    $scope.mutationIDs.push(value._id);
                                    $scope.mutations.push({
                                        mutationID: value._id,
                                        gene: value.gene,
                                        alteration: value.alteration,
                                        nctIds: [data[i].nctId]
                                    });
                                    $scope.genes.push(value.gene);
                                }
                                else {
                                    _.each($scope.mutations, function (mutation) {
                                        if (mutation.gene == value.gene && mutation.alteration == value.alteration) {
                                            mutation.nctIds.push(trialItem.nctId);
                                        }
                                    });
                                }
                            });

                        }
                        $scope.genes = _.uniq($scope.genes);
                        $scope.genes.sort();

                        $scope.tumorTypes = _.uniq($scope.tumorTypes);
                        $scope.tumorTypes.sort();

                        $scope.countries = _.uniq($scope.countries);
                        $scope.countries.sort();

                        $scope.mutations.sort(compare);
                        searchMappingByStatus();
                        $scope.trials = data;

                        endSearch();

                        $scope.previousSearch = $scope.searchKeyword;
                        $location.search('query', $scope.searchKeyword);
                        if($scope.refineFlag)
                        {
                            refine();
                        }
                        else
                        {
                            $location.search('status', '4');
                            $location.search('country', 'United States');

                        }

                        }




                },
                function (error) {
                    bootbox.alert('Oops Error occurred to search engine, please try again!');
                    console.log('search trial error happened');
                    endSearch();
                }
            );


        };

        function refine()
        {
            var location = $location.search();
            var tempCriteria = [];
            var tempTypes = [];


            $scope.chosenGenes = [];
            $scope.chosenMutations = [];
            $scope.tumor = [];
           // $scope.status = 4;
            for(var property in location){
                if(property !== 'query')
                {
                    if(property === 'status')
                    {
                        $scope.status =  location[property];
                       /* console.log('here is the status ',location[property]);
                        switch(location[property]){
                            case 'all':
                                $scope.status = 1;
                                break;
                            case 'incomplete':
                                $scope.status = 2;
                                break;
                            case 'complete':
                                $scope.status = 3;
                                break;
                        };*/
                    }


                    if(Array.isArray(location[property]))
                    {
                        if(property === 'mutation')
                        {
                            var temAlteration = [];
                            _.each($scope.mutations, function(alterationItem){
                                if(location[property].indexOf(alterationItem.mutationID) !== -1 )
                                {
                                    temAlteration.push(alterationItem);
                                }
                            });
                            tempCriteria.push({type: property, value: temAlteration });
                        }
                        else
                        {
                            tempCriteria.push({type: property, value: location[property]});
                        }

                        if(property === 'tumor'){
                            $scope.tumor = location[property];
                        }
                        else if(property === 'gene'){
                            $scope.chosenGenes = location[property];
                        }
                        else if(property === 'mutation'){
                            $scope.chosenMutations = location[property];
                        }
                        else if(property === 'country'){
                            $scope.country = location[property];
                        }
                    }
                    else
                    {
                        if(property === 'mutation')
                        {
                            var temAlteration = [];
                            _.each($scope.mutations, function(alterationItem){
                                if(location[property] === alterationItem.mutationID )
                                {
                                    temAlteration.push(alterationItem);
                                }
                            });
                            tempCriteria.push({type: property, value: temAlteration });
                        }
                        else
                        {
                            tempCriteria.push({type: property, value: [location[property]]});
                        }

                        if(property === 'tumor'){
                            $scope.tumor = [location[property]];
                        }
                        else if(property === 'gene'){
                            $scope.chosenGenes = [location[property]];
                        }
                        else if(property === 'mutation'){
                            $scope.chosenMutations = [location[property]];
                        }
                        else if(property === 'country'){
                            $scope.country = [location[property]];
                        }

                    }
                    /*
                    if($scope.country.toString() === "United States")
                    {
                        document.getElementById("USRadio").checked = true;
                        document.getElementById("countriesRadio").checked = false;
                    }
                    else
                    {
                        document.getElementById("USRadio").checked = false;
                        document.getElementById("countriesRadio").checked = true;
                        $scope.allCountries = true;
                    }
 */
                    tempTypes.push(property);





                }
            }
            $scope.criteria = tempCriteria;
            $scope.types = tempTypes;
        }

        $scope.find = function(){
            $scope.refineFlag = false;
            $scope.criteria = [{type: 'country', value: ['United States']}];
            $scope.types = ['country'];

            var location = $location.search();
            if(location.query !== undefined)
            {console.log('here go to search');
                $scope.searchKeyword = location.query;
                $scope.refineFlag = true;
                $scope.search();

            }

        }

        $rootScope.$on("$locationChangeSuccess", function (event) {
            var location = $location.search();
            if(location.query !== undefined)
            {
                if($scope.previousSearch !== location.query)
                {
                    $scope.searchKeyword = location.query;
                    $scope.search();
                }
                refine();
            }
            else
            {
                $scope.showResult = false;
                $scope.showRefine = false;
                $scope.searchKeyword = '';
            }

        });

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

                    if (criterion.type == 'status') {
                        if (criterion.value == '1') {
                            if ($scope.comTrialIds.indexOf(trial.nctId) == -1 && $scope.inComTrialIds.indexOf(trial.nctId) == -1) {
                                flags[index].value = true;
                            }
                            else {
                                flags[index].value = false;
                            }
                        }
                        else if (criterion.value == '2') {
                            if ($scope.inComTrialIds.indexOf(trial.nctId) != -1) {
                                flags[index].value = true;
                            }
                            else {
                                flags[index].value = false;
                            }
                        }
                        else if (criterion.value == '3') {
                            if ($scope.comTrialIds.indexOf(trial.nctId) != -1) {
                                flags[index].value = true;
                            }
                            else {
                                flags[index].value = false;
                            }
                        }
                        else if (criterion.value == '4') {
                            flags[index].value = true;
                        }
                    }
                    else if (criterion.type == 'mutation') {
                        var mutationNctIds = [];
                        _.each(criterion.value, function (item) {
                            mutationNctIds = mutationNctIds.concat(item.nctIds);
                        });
                        if (mutationNctIds.indexOf(trial.nctId) != -1) {
                            flags[index].value = true;
                        }
                        else {
                            flags[index].value = false;
                        }
                    }
                    else {
                        var searchStr = '';
                        for (var i = 0; i < criterion.value.length - 1; i++) {
                            searchStr += criterion.value[i] + '|';
                        }
                        searchStr += criterion.value[criterion.value.length - 1];
                        var patt = new RegExp(searchStr);
                        if (tempStr.match(patt) != undefined) {
                            flags[index].value = true;
                        }
                    }

                });

                for (var i = 0; i < flags.length; i++) {
                    finalFlag = finalFlag && flags[i].value;
                }
                return finalFlag;
            }
        };


        $scope.getCriteria = function (checked, value, type) {
            var index = $scope.criteria.map(function (e) {
                return e.type;
            }).indexOf(type);  console.log($scope.criteria, $scope.types);
            if (type == 'status' || type == 'tumor' || type == 'country') {


                if (value.length == 0) {
                    $scope.types = _.without($scope.types, type);
                    $scope.criteria.splice(index, 1);
                }
                else {
                    if ($scope.types.indexOf(type) !== -1) {
                        _.each($scope.criteria, function (criterion) {
                            if (criterion.type == type) {
                                criterion.value = value;
                            }
                        });
                    }
                    else {
                        $scope.criteria.push({type: type, value: value});
                        $scope.types.push(type);
                    }
                }

            }
            else {
                if (checked) {
                    if ($scope.types.indexOf(type) == -1) {
                        $scope.criteria.push({type: type, value: [value]});
                        $scope.types.push(type);
                    }
                    else {

                        $scope.criteria[index].value.push(value);

                    }


                }
                else {
                    if ($scope.criteria[index].value.length > 1) {
                        $scope.criteria[index].value = _.without($scope.criteria[index].value, value);
                    }
                    else {
                        $scope.criteria.splice(index, 1);
                        $scope.types = _.without($scope.types, type);
                    }

                }
            }
            var currParams = $location.search();

            for (var paramName in currParams)
            {
                if(paramName !== 'query')
                {
                    $location.search(paramName, null);
                }

            }
            _.each($scope.criteria, function(criterion){
                if(criterion.type == 'mutation')
                {
                    var tempArr = criterion.value.map(function(e){
                        //return e.gene + '+' + e.alteration;
                        return e.mutationID;
                    });
                    $location.search(criterion.type, tempArr);

                }
                else
                {
                    $location.search(criterion.type, criterion.value);
                }


            });


        };


    }
]);
