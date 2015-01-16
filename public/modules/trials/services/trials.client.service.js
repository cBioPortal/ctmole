'use strict';

//Trials service used to communicate Trials REST endpoints
angular.module('trials').factory('Trials', ['$resource',
	function($resource) {
		return  {
			nctId: $resource('trials/:nctId', { nctId: '@_id'
				}, {
					update: {
						method: 'PUT'
					}
				}),
			keyword: $resource('trials/search/:keyword', { keyword: '@_id'}),
			listWithnctIds: $resource('trials/list', {nctIds: []}, {
				search: {method: 'POST', isArray: true}
			})
		};
	}
]);