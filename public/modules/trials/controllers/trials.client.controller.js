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


            $scope.showVar = false;
            $scope.alertShow = false;
            $scope.showAll = false;
            $scope.showAllDrugs = false;

            $scope.switchStatus = function () {

                Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId}, function (u, getResponseHeaders) {
                        console.log('found trial in the mapping table', u.nctId);
                        if(u.nctId == undefined)
                        {
                            console.log('not found');

                            Mappings.mappingSave.save({nctId: $scope.trial.nctId},
                                function (newMapping) {
                                    $scope.trialMappings = newMapping;
                                    console.log('success insert record in mapping table', newMapping);

                                },
                                function (error) {
                                    console.log('did not insert successfully because of ', error);
                                }
                            );

                        }
                        else
                        {
                            u.$completeStatus({Idvalue: $scope.trial.nctId},
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

            function findAlterations(nctId) {

                var alteration_id = [];
                Mappings.mappingSearch.get({
                        Idvalue: nctId,
                    },
                    function (a) {
                        if (a.alteration) {
                            for (var i = 0; i < a.alteration.length; i++) {
                                alteration_id.push(a.alteration[i].alteration_Id);
                            }
                            if (alteration_id.length > 0) {
                                $scope.trialAlterations = Alterations.alterationByIds.query({
                                        Ids: alteration_id
                                    }
                                );
                            }
                            else {
                                $scope.trialAlterations = [];
                            }
                        } else {
                            $scope.trialAlterations = [];
                            console.log('no alteration information for this trial ID')
                        }
                    },
                    function (b) {
                        $scope.trialAlterations = [];
                        console.log('no alteration information for this trial ID')
                    });

            }

            // Find existing Trial
            $scope.findOne = function () {
                $scope.trial = Trials.nctId.get({
                    nctId: $stateParams.nctId
                });
                $scope.trialMappings = Mappings.mappingSearch.get({Idvalue: $stateParams.nctId});
                console.log('here is the mapping ', $scope.trialMappings);
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

            $scope.getEligibility = function (eligibility, elgType) {
                if (_.isUndefined(eligibility)) {
                    eligibility = '';
                }
                var m = eligibility.indexOf('Inclusion Criteria');
                var n = eligibility.indexOf('Exclusion Criteria');
                if ((m === -1 && elgType === 'inclusion') || (n === -1 && elgType === 'exclusion')) {
                    return '';
                }
                else {
                    m += 20;
                    n += 20;

                    var output = '<ol>';

                    if (elgType === 'inclusion') {
                        var inEligi = eligibility.substr(m, n - m - 20);
                        var inEligiArray = getLists(inEligi);
                        _.each(inEligiArray, function (element) {
                            output = output + '<li>' + element + '</li>';
                        });
                    }
                    else if (elgType === 'exclusion') {
                        var exEligi = eligibility.substr(n);
                        var exEligiArray = getLists(exEligi);
                        _.each(exEligiArray, function (element) {
                            output = output + '<li>' + element + '</li>';
                        });
                    }

                    output += '</ol>';
                    return output;
                }

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
                                                        //$scope.trialAlterations = findAlterations($scope.trial.nctId);
                                                        $scope.trial.alterationsFetched.push({
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
                                            $scope.trial.alterationsFetched.push({
                                                alteration: $scope.newAlteration.toUpperCase(),
                                                gene: $scope.newGene.toUpperCase()
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
                                                                $scope.trial.alterationsFetched.push({
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
                                                    $scope.trial.alterationsFetched.push({
                                                        alteration: $scope.newAlteration.toUpperCase(),
                                                        gene: $scope.newGene.toUpperCase()
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
                                console.log('find in mapping record', a._id);
                                c.$deleteAlt({Idvalue: a._id},
                                    function (e) {
                                        console.log('delete successfully');
                                        for (var i = 0; i < $scope.trial.alterationsFetched.length; i++) {
                                            var alterationItem = $scope.trial.alterationsFetched[i];
                                            if (alterationItem.alteration == alteration.toUpperCase() && alterationItem.gene == gene.toUpperCase()) {
                                                $scope.trial.alterationsFetched.splice(i, 1);
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

        }
    ]);
