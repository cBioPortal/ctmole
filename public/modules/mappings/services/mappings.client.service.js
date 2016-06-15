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

//Mappings service used to communicate Mappings REST endpoints
angular.module('mappings').factory('Mappings', ['$resource',
	function($resource) {

		return{

			mapping: $resource('mappings/:alteration/:nctId',
				{alteration: '@alteration', nctId: '@nctId'},
				{
					update: {
						method: 'PUT'
					},
					query: {isArray: true}
				}),
			mappingSearch: $resource('mappings/:Idvalue',
				{},
				{
					update: {
						method: 'PUT'
					},
					completeStatus: {
						method: 'POST',
						isArray: false
					},
					get: {
						method: 'GET',
						isArray: false
					},
					convertLog: {
						method: 'PATCH',
						isArray: true
					}
				}
			),
			searchByStatus: $resource('mappingStatus', {}, {
				'query':  {method:'GET', isArray:true}
			}),
			mappingSave: $resource('mappingSave/:nctId', {nctId: '@nctId'}, {

				}),
			commentsSave: $resource('commentsSave/:trialID/:comment', {trialID: '@nctId'}, {
				commentsSave: {
					method: 'GET'
				}
			}),
			confirmAlteration: $resource('confirmAlteration/:trialID/:gene/:alteration/:type', {trialID: '@nctId'}, {
				confirmAlteration: {
					method: 'GET'
				}
			}),
			deleteAlteration: $resource('deleteAlteration/:trialID/:gene/:alteration/:type', {trialID: '@nctId'}, {
				deleteAlteration: {
					method: 'GET'
				}
			}),
			convertLog: $resource('convertLog/:trialID', {trialID: '@nctId'}, {
				get: {
					method: 'GET',
					isArray: true
				}
			}),
			geneTrialCounts: $resource('geneTrialCounts/', {}, {
				get: {
					method: 'GET',
					isArray: true
				}
			}),
			curationStatusCounts: $resource('curationStatusCounts/', {}, {
				get: {
					method: 'GET',
					isArray: true
				}
			}),
			deleteAlterationByTumor: $resource('deleteAlterationByTumor/:trialID/:gene/:alteration/:type/:tumor', {trialID: '@nctId'}, {
				deleteAlterationByTumor: {
					method: 'GET'
				}
			}),
			addTumor: $resource('addTumor/:trialID/:tumor/:predictedTumors', {trialID: '@nctId',tumor: '@oncoTreeTumors'}, {
				get: {
					method: 'GET'
				}
			}),
			deleteTumor: $resource('deleteTumor/:trialID/:tumor', {trialID: '@nctId',tumor: '@oncoTreeTumors'}, {
				get: {
					method: 'GET'
				}
			}),
                        preciseSearchEngine: $resource('preciseSearchEngine/:gene/:alteration/:tumorType', {}, {
				'query':  {method:'GET', isArray:true}
			})
		};

	}
]);
