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

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'clinicaltrials';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
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

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('alterations');
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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cancertypes');
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

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('drugs');
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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('genes');
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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('mappings');
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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('trials');
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

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

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

// Configuring the Articles module
angular.module('alterations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Details', '/', 'dropdown', false);
        //Menus.addSubMenuItem('topbar', '/', 'List Genes', 'genes');
        //Menus.addSubMenuItem('topbar', '/', 'List Alterations', 'alterations');
        //Menus.addSubMenuItem('topbar', '/', 'List Cancer Types', 'cancertypes');
        //Menus.addSubMenuItem('topbar', '/', 'List Drugs', 'drugs');
        Menus.addSubMenuItem('topbar', '/', 'List Trials', 'trials');
        //Menus.addSubMenuItem('topbar', '/', 'Search Trial', 'trials/search');
	}
]);
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

//Setting up route
angular.module('alterations').config(['$stateProvider',
	function($stateProvider) {
		// Alterations state routing
		$stateProvider.
		state('listAlterations', {
			url: '/alterations',
			templateUrl: 'modules/alterations/views/list-alterations.client.view.html'
		}).
		state('createAlteration', {
			url: '/alterations/create',
			templateUrl: 'modules/alterations/views/create-alteration.client.view.html'
		}).
		state('viewAlteration', {
			url: '/alterations/:alterationId',
			templateUrl: 'modules/alterations/views/view-alteration.client.view.html'
		}).
		state('editAlteration', {
			url: '/alterations/:alterationId/edit',
			templateUrl: 'modules/alterations/views/edit-alteration.client.view.html'
		});
	}
]);
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

// Alterations controller
angular.module('alterations').controller('AlterationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Alterations',
	function($scope, $stateParams, $location, Authentication, Alterations ) {
		$scope.authentication = Authentication;

		// Create new Alteration
		$scope.create = function() {
			// Create new Alteration object
			var alteration = new Alterations ({
				name: this.name
			});

			// Redirect after save
			alteration.$save(function(response) {
				$location.path('alterations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Alteration
		$scope.remove = function( alteration ) {
			if ( alteration ) { alteration.$remove();

				for (var i in $scope.alterations ) {
					if ($scope.alterations [i] === alteration ) {
						$scope.alterations.splice(i, 1);
					}
				}
			} else {
				$scope.alteration.$remove(function() {
					$location.path('alterations');
				});
			}
		};

		// Update existing Alteration
		$scope.update = function() {
			var alteration = $scope.alteration ;

			alteration.$update(function() {
				$location.path('alterations/' + alteration._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Alterations
		$scope.find = function() {
			$scope.alterations = Alterations.alteration.query();
		};

		// Find existing Alteration
		$scope.findOne = function() {
			$scope.alteration = Alterations.alteration.get({
				alterationSymbol: $stateParams.alterationSymbol,
				geneRecordName: $stateParams.geneRecordName
			});
		};
	}
]);

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

//Alterations service used to communicate Alterations REST endpoints
/*
angular.module('alterations').factory('Alterations', ['$resource',
	function($resource) {
		return $resource('alterations/:alterationId', { alterationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

*/

angular.module('alterations').factory('Alterations', ['$resource',
	function($resource) {
		return {
			alterationByIds: $resource('alterations/:Ids', {Ids:[]}, {query: {isArray: true}}),

			alteration: $resource('alterations/:alteration/:gene', { alteration: '@alteration',gene: '@gene'
			}, {
				update: {
					method: 'PUT'
				},
				query: {isArray: true}
			}),
			searchEngine: $resource('alterationGeneral/:searchEngineKeyword', {
			}, {
				'query':  {method:'GET', isArray:true}
			})


		};
	}
]);








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

// Configuring the Articles module
angular.module('cancertypes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Cancer Types', 'cancertypes', 'dropdown', '/cancertypes(/create)?');
		// Menus.addSubMenuItem('topbar', 'cancertypes', 'List Cancer Types', 'cancertypes');
		// Menus.addSubMenuItem('topbar', 'cancertypes', 'New Cancertype', 'cancertypes/create');
	}
]);
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

//Setting up route
angular.module('cancertypes').config(['$stateProvider',
	function($stateProvider) {
		// Cancertypes state routing
		$stateProvider.
		state('listCancertypes', {
			url: '/cancertypes',
			templateUrl: 'modules/cancertypes/views/list-cancertypes.client.view.html'
		}).
		state('createCancertype', {
			url: '/cancertypes/create',
			templateUrl: 'modules/cancertypes/views/create-cancertype.client.view.html'
		}).
		state('viewCancertype', {
			url: '/cancertypes/:cancertypeSymbol',
			templateUrl: 'modules/cancertypes/views/view-cancertype.client.view.html'
		}).
		state('editCancertype', {
			url: '/cancertypes/:cancertypeSymbol/edit',
			templateUrl: 'modules/cancertypes/views/edit-cancertype.client.view.html'
		});
	}
]);

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

// Cancertypes controller
angular.module('cancertypes').controller('CancertypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cancertypes',
	function($scope, $stateParams, $location, Authentication, Cancertypes ) {
		$scope.authentication = Authentication;

		// Create new Cancertype
		$scope.create = function() {
			// Create new Cancertype object
			var cancertype = new Cancertypes ({
				name: this.name
			});

			// Redirect after save
			cancertype.$save(function(response) {
				$location.path('cancertypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cancertype
		$scope.remove = function( cancertype ) {
			if ( cancertype ) { cancertype.$remove();

				for (var i in $scope.cancertypes ) {
					if ($scope.cancertypes [i] === cancertype ) {
						$scope.cancertypes.splice(i, 1);
					}
				}
			} else {
				$scope.cancertype.$remove(function() {
					$location.path('cancertypes');
				});
			}
		};

		// Update existing Cancertype
		$scope.update = function() {
			var cancertype = $scope.cancertype ;

			cancertype.$update(function() {
				$location.path('cancertypes/' + cancertype.symbol);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cancertypes
		$scope.find = function() {
			$scope.cancertypes = Cancertypes.query();
		};

		// Find existing Cancertype
		$scope.findOne = function() {
			$scope.cancertype = Cancertypes.cancertype.get({
				cancertypeSymbol: $stateParams.cancertypeSymbol
			});
		};

		$scope.trial = function(trialId) {
			$location.open('#!/trials/' + trialId);
		};
	}
]);


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
/*
//Cancertypes service used to communicate Cancertypes REST endpoints
angular.module('cancertypes').factory('Cancertypes', ['$resource',
	function($resource) {
		return $resource('cancertypes/:cancertypeId', { cancertypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

*/


angular.module('cancertypes').factory('Cancertypes', ['$resource',
	function($resource) {
		return {
			cancertype: $resource('cancertypes/:cancertypeSymbol', { cancertypeSymbol: '@symbol'
			}, {
				update: {
					method: 'PUT'
				},
				query: {isArray: true}
			}),
			newCancertype: $resource('cancertypes/:newCancertypeSymbol/:nctId', { newCancertypeSymbol: '@symbol'
			}),
			nctIds: $resource('cancertypes/trials/:nctIds', {nctIds: []}, {get: {isArray: true}})
		};
	}
]);







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

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
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

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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




angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Trials','Mappings','Alterations',
	function($scope, Authentication, Trials, Mappings, Alterations) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.loading = false;
		$scope.showResult = false;
		$scope.showRefine = false;
		$scope.allCountries = false;
		$scope.firstSearch = true;

		$scope.countryCriteria = ['United States'];
		$scope.criteria = [{type: 'country', value: ['United States']}];
		$scope.types = ['country'];
		$scope.geneCriteria = [];
		$scope.mutationCriteria = [];
		$scope.trialsNctIds = [];
		$scope.comTrialIds = [];
		$scope.trials = [];


		$scope.find = function()
		{
			document.getElementById("USRadio").checked = true;
		}


		function endSearch()
		{
			$scope.loading = false;
			$scope.showResult = true;
			$scope.showRefine = true;
		}
		function compare(a,b) {
			if (a.last_nom < b.last_nom)
				return -1;
			if (a.last_nom > b.last_nom)
				return 1;
			return 0;
		}

		function autoCreateFilters(data)
		{
			_.each(data, function(trialItem)
			{
					Mappings.mappingSearch.get({
							Idvalue: trialItem.nctId
						},
						function(a)
						{
							if(a.alteration) {
								var alteration_id = [];
								for(var i = 0;i < a.alteration.length;i++)
								{
									alteration_id.push(a.alteration[i].alteration_Id);
								}
								if(alteration_id.length > 0)
								{
									Alterations.alterationByIds.query({
											Ids: alteration_id
										},
										function(alterations)
										{
											_.map(alterations, function(value){
												if($scope.mutationIDs.indexOf(value._id) == -1)
												{
													$scope.mutationIDs.push(value._id);
													$scope.mutations.push({gene: value.gene, alteration: value.alteration, nctIds: [ trialItem.nctId ] });
													$scope.genes.push(value.gene);
													$scope.genes = _.uniq($scope.genes);
												}
												else
												{
													_.each($scope.mutations, function(mutation)
													{
														if(mutation.gene == value.gene && mutation.alteration == value.alteration)
														{
															mutation.nctIds.push(trialItem.nctId);
														}
													});
												}
											});
											$scope.mutations.sort(compare);
											$scope.genes.sort();
										}
									);


								}
							}

						},
						function(b)
						{}
					);

			});


		}


		$scope.showAllCountries = function()
		{
			$scope.allCountries = true;
			_.each($scope.criteria, function(criterion)
			{
				if(criterion.type == 'country')
				{
					criterion.value = ['United States'];
				}
			});

		}
		$scope.hideAllCountries = function()
		{
			$scope.allCountries = false;
			_.each($scope.criteria, function(criterion)
			{
				if(criterion.type == 'country')
				{
					criterion.value = ['United States'];
				}
			});

		}
		$scope.search = function(searchStr) {
			var searchKeyword = $scope.searchKeyword;
			if(searchKeyword === undefined)
			{
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

			//search in the trial table
			Trials.searchEngine.query({searchEngineKeyword: searchKeyword}, function (data) {
					if(data instanceof  Array) {

						if(data.length == 0)
						{
							bootbox.alert('Sorry no result found! Please change your input to restart search');
							$scope.searchKeyword = '';
							$scope.loading = false;
							return false;
						}
						else
						{
							for(var i = 0;i < data.length;i++)
							{
								$scope.countries = $scope.countries.concat(data[i].countries);
								$scope.trialsNctIds.push(data[i].nctId);
								_.each(data[i].tumorTypes, function(tumorItem)
								{

									$scope.tumorTypes.push(tumorItem.tumorTypeId);
								});
							}
							$scope.tumorTypes = _.uniq($scope.tumorTypes);
							$scope.tumorTypes.sort();

							$scope.countries = _.uniq($scope.countries);
							$scope.countries.sort();

							searchMappingByStatus();
							$scope.trials = data;
							autoCreateFilters(data);
							endSearch();
						}
					}


			},
			function(error)
			{

				console.log('search trial error happened');
			}
			);
			//search in the mapping table
			function searchMappingByStatus()
			{

				Mappings.searchByStatus.query({
						status: true
					},
					function (data) {
						if(data.length > 0)
						{
							for(var i = 0;i < data.length;i++)
							{
								$scope.comTrialIds.push(data[i].nctId);
							}

						}
					},
					function(error)
					{
						console.log('No hits in the mapping table');
					}
				);
			}

		};

		$scope.searchCriteria = function() {
			return function(trial) {
				var tempStr = JSON.stringify(trial);
				var finalFlag = true;
				var flags = [];

				var types = $scope.types;
				for(var i = 0;i < types.length;i++)
				{
					flags.push({type: types[i], value: false});
				}
				_.each($scope.criteria, function(criterion)
				{
					var index = $scope.criteria.map(function(e) { return e.type; }).indexOf(criterion.type);
					if(criterion.type == 'status')
					{
						if(criterion.value == 'incomplete')
						{
							if ($scope.comTrialIds.indexOf(trial.nctId) == -1)
							{
								flags[index].value = true;
							}
							else
							{
								flags[index].value = false;
							}
						}
						else if(criterion.value == 'complete')
						{
							if ($scope.comTrialIds.indexOf(trial.nctId) != -1)
							{
								flags[index].value = true;
							}
							else
							{
								flags[index].value = false;
							}
						}
					}
					else if(criterion.type == 'mutation')
					{
						var mutationNctIds = [];
						_.each(criterion.value, function(item)
						{
							mutationNctIds = mutationNctIds.concat(item.nctIds);
						});
						if (mutationNctIds.indexOf(trial.nctId) != -1)
						{
							flags[index].value = true;
						}
						else
						{
							flags[index].value = false;
						}
					}
					else
					{
						var searchStr = '';
						for(var i = 0;i < criterion.value.length-1;i++)
						{
							searchStr += criterion.value[i] + '|';
						}
						searchStr += criterion.value[criterion.value.length-1];
						var patt = new RegExp(searchStr);
						if(tempStr.match(patt) != undefined)
						{
							flags[index].value = true;
						}
					}

				});

				for(var i = 0;i < flags.length;i++)
				{
					finalFlag = finalFlag && flags[i].value;
				}
				return finalFlag;
			}
		};


		$scope.getCriteria = function(checked, value, type)
		{

			var index = $scope.criteria.map(function(e) { return e.type; }).indexOf(type);
			if(type == 'status' || type == 'tumor' || type == 'country')
			{
				if(value.length == 0)
				{
					$scope.types = _.without($scope.types, type);
					$scope.criteria.splice(index, 1);
				}
				else
				{
					if($scope.types.indexOf(type) !== -1)
					{
						_.each($scope.criteria, function(criterion)
						{
							if(criterion.type == type)
							{
								criterion.value = value;
							}
						});
					}
					else
					{
						$scope.criteria.push({type: type, value: value});
						$scope.types.push(type);
					}
				}


			}
			else
			{
				if(checked)
				{
					if ($scope.types.indexOf(type) == -1)
					{
						$scope.criteria.push({type: type, value: [value]});
						$scope.types.push(type);
					}
					else
					{
						$scope.criteria[index].value.push(value);
					}


				}
				else
				{
					if($scope.criteria[index].value.length > 1)
					{
						$scope.criteria[index].value = _.without($scope.criteria[index].value, value);
					}
					else
					{
						$scope.criteria.splice(index, 1);
						$scope.types = _.without($scope.types, type);
					}

				}
			}

		};


	}
]);


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

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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

// Configuring the Articles module
angular.module('drugs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Drugs', 'drugs', 'dropdown', '/drugs(/create)?');
		// Menus.addSubMenuItem('topbar', 'drugs', 'List Drugs', 'drugs');
		// Menus.addSubMenuItem('topbar', 'drugs', 'New Drug', 'drugs/create');
	}
]);
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

//Setting up route
angular.module('drugs').config(['$stateProvider',
	function($stateProvider) {
		// Drugs state routing
		$stateProvider.
		state('listDrugs', {
			url: '/drugs',
			templateUrl: 'modules/drugs/views/list-drugs.client.view.html'
		}).
		state('createDrug', {
			url: '/drugs/create',
			templateUrl: 'modules/drugs/views/create-drug.client.view.html'
		}).
		state('viewDrug', {
			url: '/drugs/:drugId',
			templateUrl: 'modules/drugs/views/view-drug.client.view.html'
		}).
		state('editDrug', {
			url: '/drugs/:drugId/edit',
			templateUrl: 'modules/drugs/views/edit-drug.client.view.html'
		});
	}
]);
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

// Drugs controller
angular.module('drugs').controller('DrugsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Drugs',
	function($scope, $stateParams, $location, Authentication, Drugs ) {
		$scope.authentication = Authentication;

		// Create new Drug
		$scope.create = function() {
			// Create new Drug object
			var drug = new Drugs ({
				name: this.name
			});

			// Redirect after save
			drug.$save(function(response) {
				$location.path('drugs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Drug
		$scope.remove = function( drug ) {
			if ( drug ) { drug.$remove();

				for (var i in $scope.drugs ) {
					if ($scope.drugs [i] === drug ) {
						$scope.drugs.splice(i, 1);
					}
				}
			} else {
				$scope.drug.$remove(function() {
					$location.path('drugs');
				});
			}
		};

		// Update existing Drug
		$scope.update = function() {
			var drug = $scope.drug ;

			drug.$update(function() {
				$location.path('drugs/' + drug._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Drugs
		$scope.find = function() {
			$scope.drugs = Drugs.regular.query();
		};

		// Find existing Drug
		$scope.findOne = function() {
			$scope.drug = Drugs.regular.get({ 
				drugId: $stateParams.drugId
			});
		};
	}
]);
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

//Drugs service used to communicate Drugs REST endpoints
angular.module('drugs').factory('Drugs', ['$resource',
	function($resource) {
		return {
			full: $resource('drugs/full', {}, {
					update: {
						method: 'PUT'
					}
				}),
			regular: $resource('drugs/:drugId', { drugId: '@_id'
				}, {
					update: {
						method: 'PUT'
					}
				})
		};
		
	}
]);
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

// Configuring the Articles module
angular.module('genes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Genes', 'genes', 'dropdown', '/genes(/create)?');
		// Menus.addSubMenuItem('topbar', 'genes', 'List Genes', 'genes');
		// Menus.addSubMenuItem('topbar', 'genes', 'New Gene', 'genes/create');
	}
]);
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

//Setting up route
angular.module('genes').config(['$stateProvider',
	function($stateProvider) {
		// Genes state routing
		$stateProvider.
		state('listGenes', {
			url: '/genes',
			templateUrl: 'modules/genes/views/list-genes.client.view.html'
		}).
		state('createGene', {
			url: '/genes/create',
			templateUrl: 'modules/genes/views/create-gene.client.view.html'
		}).
		state('viewGene', {
			url: '/genes/:symbol',
			templateUrl: 'modules/genes/views/view-gene.client.view.html'
		}).
		state('editGene', {
			url: '/genes/:symbol/edit',
			templateUrl: 'modules/genes/views/edit-gene.client.view.html'
		});
	}
]);

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

// Genes controller
angular.module('genes').controller('GenesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Genes',
	function($scope, $stateParams, $location, Authentication, Genes ) {
		$scope.authentication = Authentication;

		// Create new Gene
		$scope.create = function() {
			// Create new Gene object
			var gene = new Genes ({
				name: this.name
			});

			// Redirect after save
			gene.$save(function(response) {
				$location.path('genes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gene
		$scope.remove = function( gene ) {
			if ( gene ) { gene.$remove();

				for (var i in $scope.genes ) {
					if ($scope.genes [i] === gene ) {
						$scope.genes.splice(i, 1);
					}
				}
			} else {
				$scope.gene.$remove(function() {
					$location.path('genes');
				});
			}
		};

		// Update existing Gene
		$scope.update = function() {
			var gene = $scope.gene ;

			gene.$update(function() {
				$location.path('genes/' + gene._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Genes
		$scope.find = function() {
			$scope.genes = Genes.gene.query();
		};

		// Find existing Gene
		$scope.findOne = function() {
			$scope.gene = Genes.gene.get({
				symbol: $stateParams.symbol
			});
		};
	}
]);

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

angular.module('genes').filter('asc', [
	function() {
		return function(input) {
			// Asc directive logic
			// ...

			return 'asc filter: ' + input;
		};
	}
]);
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

//Genes service used to communicate Genes REST endpoints
angular.module('genes').factory('Genes', ['$resource',
	function($resource) {
		return {
            gene: $resource('genes/:symbol', { symbol: '@symbol'
    		}, {
    			update: {
    				method: 'PUT'
    			},
                query: {isArray: true}
    		}),
            nctIds: $resource('genes/trials/:nctIds', {nctIds: []}, {get: {isArray: true}, put: {}})
        };
	}
]);

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

// Configuring the Articles module
angular.module('mappings',['localytics.directives', 'angular-underscore', 'datatables', 'datatables.bootstrap'])
.constant('Venn', window.venn)
.constant('D3', window.d3)
.constant('S', window.S)
.constant('_', window._)
.run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mappings', 'mappings', 'dropdown', false, true, ['*'], -1);
		//Menus.addSubMenuItem('topbar', 'mappings', 'Find common trials', 'mappings');
        Menus.addSubMenuItem('topbar', 'mappings', 'Assign rules', 'trials/assign');
		// Menus.addSubMenuItem('topbar', 'mappings', 'New Mapping', 'mappings/create');
	}
]);
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

//Setting up route
angular.module('mappings').config(['$stateProvider',
	function($stateProvider) {
		// Mappings state routing
		$stateProvider.
		state('mapping', {
			url: '/mappings',
			controller: 'MappingsController',
			templateUrl: 'modules/mappings/views/search-mappings.client.view.html'
		}).
		state('list', {
			url: '/mappings/list',
			controller: 'MappingsController',
			templateUrl: 'modules/mappings/views/list-mappings.client.view.html'
		});
	}
]);
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
					deleteAlt: {
						method: 'PATCH'
					},
					completeStatus: {
						method: 'POST',
						isArray: false
					},
					get: {
						method: 'GET',
						isArray: false
					}
				}
			),
			searchEngine: $resource('mappingGeneral/:searchEngineKeyword', {
			}, {
				'query':  {method:'GET', isArray:true}
			}),
			searchByStatus: $resource('mappingStatus/:status', {status: '@completeStatus'
			}, {
				'query':  {method:'GET', isArray:true}
			}),
			searchByAltId: $resource('mappingGeneral/mappingAltId/:altId', {}, {
				'query':  {method:'GET', isArray:true}
			})

		};

	}
]);

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

// Configuring the Articles module
angular.module('trials').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Trials', 'trials', 'dropdown', '/trials(/create)?');
		// Menus.addSubMenuItem('topbar', 'trials', 'List Trials', 'trials');
		// Menus.addSubMenuItem('topbar', 'trials', 'Search Trial', 'trials/search');
	}
]);
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

//Setting up route
angular.module('trials').config(['$stateProvider',
	function($stateProvider) {
		// Trials state routing
		$stateProvider.
		state('listTrials', {
			url: '/trials',
			templateUrl: 'modules/trials/views/list-trials.client.view.html'
		}).
		state('createTrial', {
			url: '/trials/create',
			templateUrl: 'modules/trials/views/create-trial.client.view.html'
		}).
		state('searchTrial', {
			url: '/trials/search',
			templateUrl: 'modules/trials/views/search-trial.client.view.html'
		}).
		state('searchByKeyword', {
			url: '/trials/search/:keyword',
			templateUrl: 'modules/trials/views/search-trial.client.view.html'
		}).
		state('assignTrial', {
			url: '/trials/assign',
			templateUrl: 'modules/trials/views/assign-trial.client.view.html'
		}).
		state('assignTrialByKeyword', {
			url: '/trials/assign/:keyword',
			templateUrl: 'modules/trials/views/assign-trial.client.view.html'
		}).
		state('viewTrial', {
			url: '/trials/:nctId',
			templateUrl: 'modules/trials/views/view-trial.client.view.html'
		}).
		state('editTrial', {
			url: '/trials/:nctId/edit',
			templateUrl: 'modules/trials/views/edit-trial.client.view.html'
		});
	}
]);
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
		'Drugs','Mappings',
		function($scope, $stateParams, $location, Authentication, Trials, Genes, Alterations, Cancertypes, Drugs, Mappings) {
			$scope.authentication = Authentication;
			$scope.nctId = '';
			$scope.drugHeader = ['Drug Name','Synonyms','FDA Approved','ATC Codes','Description'];
			$scope.drugItems = ['drugName','synonyms','fdaApproved','atcCodes','description'];
			$scope.tumorHeader = ['Name','Tissue','Clinical TrialKeywords'];
			$scope.tumorItems = ['name','tissue','clinicalTrialKeywords'];


			$scope.showVar = false;
			$scope.alertShow = false;
			$scope.showAll = false;
			$scope.showAllDrugs = false;

			$scope.switchStatus = function()
			{

				Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId}, function(u, getResponseHeaders){
						console.log('found trial in the mapping table',u);
						u.$completeStatus({Idvalue: $scope.trial.nctId},
							function(response) {
								console.log('success updated');
								$scope.trialMappings = Mappings.mappingSearch.get({Idvalue: $stateParams.nctId});
							}, function(response)  {
								console.log('failed');
							});
					}, function(error){
						console.log('error: ', error);
					}
				);

			};
			$scope.showAllTitle = function()
			{
				$scope.showVar = true;
			};

			$scope.showDrugs = function()
			{
				$scope.showAllDrugs = !$scope.showAllDrugs;
			};

			$scope.displayStyle = function()
			{
				$scope.showAll = !$scope.showAll;
			};

			// Create new Trial
			$scope.create = function() {
				// Create new Trial object
				var trial = new Trials ({
					nctId: this.name
				});

				// Redirect after save
				trial.$save(function(response) {
					$location.path('trials/' + response._id);

					// Clear form fields
					$scope.name = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			// Remove existing Trial
			$scope.remove = function( trial ) {
				if ( trial ) { trial.$remove();

					for (var i in $scope.trials ) {
						if ($scope.trials [i] === trial ) {
							$scope.trials.splice(i, 1);
						}
					}
				} else {
					$scope.trial.$remove(function() {
						$location.path('trials');
					});
				}
			};

			// Update existing Trial
			$scope.update = function() {
				var trial = $scope.trial ;

				trial.$update(function() {
					$location.path('trials/' + trial.nctId);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			// Find a list of Trials
			$scope.find = function() {
				$scope.trials = Trials.nctId.query();
			};

			function findAlterations(nctId)
			{

				var alteration_id = [];
				Mappings.mappingSearch.get({
						Idvalue: nctId,
					},
					function(a)
					{
						if(a.alteration) {
							for(var i = 0;i < a.alteration.length;i++)
							{
								alteration_id.push(a.alteration[i].alteration_Id);
							}
							if(alteration_id.length > 0)
							{
								$scope.trialAlterations = Alterations.alterationByIds.query({
										Ids: alteration_id
									}
								);
							}
							else
							{
								$scope.trialAlterations = [];
							}
						}else{
							$scope.trialAlterations = [];
							console.log('no alteration information for this trial ID')
						}
					},
					function(b)
					{
						$scope.trialAlterations = [];
						console.log('no alteration information for this trial ID')
					});

			}
			// Find existing Trial
			$scope.findOne = function() {
				$scope.trial = Trials.nctId.get({
					nctId: $stateParams.nctId
				});

				$scope.trialAlterations = findAlterations($stateParams.nctId);

				//$scope.trialMappings = {completeStatus: false};

				$scope.trialMappings = Mappings.mappingSearch.get({Idvalue: $stateParams.nctId});
			};

			$scope.searchByKeyword = function() {
				$scope.trials = Trials.keyword.query({
					keyword: $scope.keyword
				});
				console.log($scope.trials);
			};

			$scope.searchTrailBynctId = function() {
				$location.path('trials/' + $scope.nctId);
			};

			$scope.assignTrailBynctId = function() {
				$scope.trial = Trials.nctId.get({
					nctId: $scope.nctId
				});
				$scope.trialGenes = Genes.nctIds.get({
					nctIds: [$scope.nctId]
				});
				console.log($scope.trialGenes);
			};

			$scope.getDrugs = function(drugs) {
				return drugs.map(function(e){return e.drugName;}).join(', ');
			};

			var getLists = function(str)
			{
				var slicedResult = [];

				if((str.indexOf('1. ') !== -1 && (str.indexOf('1. ') < str.indexOf(' - ') ||  str.indexOf(' - ') === -1)))
				{
					slicedResult = str.replace(/(\d)[.]\s/g, '\u000B').split('\u000B');
					slicedResult = _.map(slicedResult, function(value){
						return value.slice(0,-1).trim();});
					slicedResult =  _.compact(slicedResult);

				}
				else
				{
					slicedResult = str.split(' - ');
					slicedResult = _.map(slicedResult, function(value){return value.trim();});
					slicedResult =  _.compact(slicedResult);
					//slicedResult = ["pear","watermelon","orange"];
				}

				slicedResult = _.map(slicedResult, function(element){return element.split('. ');});
				slicedResult = _.flatten(slicedResult);
				return slicedResult;
			};

			$scope.getEligibility = function(eligibility, elgType){
				if(_.isUndefined(eligibility))
				{
					eligibility = '';
				}
				var m = eligibility.indexOf('Inclusion Criteria');
				var n = eligibility.indexOf('Exclusion Criteria');
				if((m === -1 && elgType === 'inclusion') || (n === -1 && elgType === 'exclusion'))
				{
					return '';
				}
				else
				{
					m += 20;
					n += 20;

					var output = '<ol>';

					if(elgType === 'inclusion')
					{
						var inEligi = eligibility.substr(m,n-m-20);
						var inEligiArray = getLists(inEligi);
						_.each(inEligiArray,function(element){output = output + '<li>' + element + '</li>';});
					}
					else if(elgType === 'exclusion')
					{
						var exEligi = eligibility.substr(n);
						var exEligiArray = getLists(exEligi);
						_.each(exEligiArray,function(element){output = output + '<li>' + element + '</li>';});
					}

					output += '</ol>';
					return output;
				}

			};


			//Add new connection between alterations and current trial
			$scope.addAlterationBynctId = function() {
				Alterations.alteration.get({alteration: $scope.newAlteration, gene: $scope.newGene}, function (u, getResponseHeaders) {

					if(u._id) {

						console.log('alteration existed...');
						Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId},
							function(a){
								if(a._id) {
									console.log('nctId record exist in mapping table...', a);
									Mappings.mapping.get({alteration: u._id, nctId: $scope.trial.nctId},
										function(mapRecord)
										{
											if(mapRecord._id) {
												console.log('nothing else need to do', mapRecord);
											}else{
												console.log('update alteration array');
												a.$update({Idvalue: u._id},
													function(){
														console.log('successfully update alteration array');
														$scope.trialAlterations = findAlterations($scope.trial.nctId);
													},
													function(){
														console.log('update alteration array failed');
													}
												);
											}
										},
										function()
										{

										}
									);
								}else {
									//insert new mapping record
									console.log('nctId record not exist in mapping table...');

									Mappings.mapping.save({alteration: u._id, nctId: $scope.trial.nctId},
										function()
										{
											console.log('success insert record in mapping table');
											$scope.trialAlterations = findAlterations($scope.trial.nctId);
										},
										function(error)
										{
											console.log('did not insert successfully because of ', error);
										}
									);
								}

							},
							function(b){


							}
						);

					}else {
						Alterations.alteration.save({alteration: $scope.newAlteration ,gene: $scope.newGene},
							function(u, getResponseHeaders){
								console.log('save alteration successfully');
								//search mapping record by nctId
								//also need to check if nctId record already exist or not like the above block
								Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId},
									function(a){
										if(a._id) {
											console.log('nctId record exist in mapping table...', a);
											Mappings.mapping.get({alteration: u._id, nctId: $scope.trial.nctId},
												function(mapRecord)
												{
													if(mapRecord._id) {
														console.log('nothing else need to do', mapRecord);
													}else{
														console.log('update alteration array');
														a.$update({Idvalue: u._id},
															function(){
																console.log('successfully update alteration array');
																$scope.trialAlterations = findAlterations($scope.trial.nctId);
															},
															function(){
																console.log('update alteration array failed');
															}
														);
													}
												},
												function()
												{

												}
											);
										}else {
											//insert new mapping record
											console.log('nctId record not exist in mapping table...');

											Mappings.mapping.save({alteration: u._id, nctId: $scope.trial.nctId},
												function()
												{
													console.log('success insert record in mapping table');
													$scope.trialAlterations = findAlterations($scope.trial.nctId);
												},
												function(error)
												{
													console.log('did not insert successfully because of ', error);
												}
											);
										}
									},
									function(b){


									}
								);


							},function(){
								console.log('failed to save alteration ');
							}
						);
					}

				}, function (getError) {
					// the alteration didn't exist, so insert to both alteration and mapping, and update trial alteration information

					console.log('alteration did not exist');



				});
			};
			$scope.deleteAlteration = function(alteration, gene) {
				Alterations.alteration.get({alteration: alteration, gene: gene},
					function(a)
					{
						console.log('find this alteration');
						Mappings.mappingSearch.get({Idvalue: $scope.trial.nctId},
							function(c)
							{
								console.log('find in mapping record', a._id);
								c.$deleteAlt({Idvalue: a._id},
									function(e)
									{
										console.log('delete successfully');
										$scope.trialAlterations = findAlterations($scope.trial.nctId);
									},
									function(f)
									{
										console.log('delete failed',f);
									}
								);
							},
							function(d)
							{
								console.log('not find mapping record');
							}
						)
					},
					function(b)
					{
						console.log('not find this alteration');
					}
				)
			};

			$scope.updateTrial = function()
			{

				Trials.updateRequestedTrial.get({requestednctId: $scope.trial.nctId}, function(u, getResponseHeaders){

						u.$update(function(response) {
							$scope.trial = Trials.nctId.get({
								nctId: $stateParams.nctId
							});
							console.log('success updated');
						}, function(response)  {
							console.log('failed');
						});
					}, function(error){
						console.log('error: ', error);
					}
				);


			};

		}
	]);

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

//Trials service used to communicate Trials REST endpoints
angular.module('trials').factory('Trials', ['$resource',
	function($resource) {
		return  {
			nctId: $resource('trials/:nctId', { nctId: '@nctId'
				}, {
					update: {
						method: 'PUT'
					}
				}),
			keyword: $resource('trials/search/:keyword', { keyword: '@_id'}),
			listWithnctIds: $resource('trials/list', {nctIds: []}, {
				search: {method: 'POST', isArray: true}
			}),
			updateRequestedTrial: $resource('trials/:requestednctId', { requestednctId: '@nctId'
			}, {
				update: {
					method: 'PUT'
				},
				updateStatus:{method: 'POST'}
			}),
			searchEngine: $resource('trials/search/:searchEngineKeyword', {
			}, {
				'query':  {method:'GET', isArray:true}
			}),
			nctIds: $resource('trialsMultiSearch/:nctIds', {nctIds: []
			}, {
				'query':  {method:'GET', isArray:true}
			})
		};
	}
]);

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

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
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

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
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

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
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

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
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

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

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

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
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

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
