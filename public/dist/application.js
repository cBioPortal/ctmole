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
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('alterations');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cancertypes');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('drugs');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('genes');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('mappings');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('trials');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('alterations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Details', '/', 'dropdown', '/');
        Menus.addSubMenuItem('topbar', '/', 'List Genes', 'genes');
		Menus.addSubMenuItem('topbar', '/', 'List Alterations', 'alterations');
		Menus.addSubMenuItem('topbar', '/', 'List Cancer Types', 'cancertypes');
        Menus.addSubMenuItem('topbar', '/', 'List Drugs', 'drugs');
        Menus.addSubMenuItem('topbar', '/', 'List Trials', 'trials');
        Menus.addSubMenuItem('topbar', '/', 'Search Trial', 'trials/search');
	}
]);
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
			$scope.alterations = Alterations.query();
		};

		// Find existing Alteration
		$scope.findOne = function() {
			$scope.alteration = Alterations.get({ 
				alterationId: $stateParams.alterationId
			});
		};
	}
]);
'use strict';

//Alterations service used to communicate Alterations REST endpoints
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
			url: '/cancertypes/:cancertypeId',
			templateUrl: 'modules/cancertypes/views/view-cancertype.client.view.html'
		}).
		state('editCancertype', {
			url: '/cancertypes/:cancertypeId/edit',
			templateUrl: 'modules/cancertypes/views/edit-cancertype.client.view.html'
		});
	}
]);
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
				$location.path('cancertypes/' + cancertype._id);
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
			$scope.cancertype = Cancertypes.get({ 
				cancertypeId: $stateParams.cancertypeId
			});
		};

		$scope.trial = function(trialId) {
			$location.open('#!/trials/' + trialId);
		};
	}
]);
'use strict';

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
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
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
			url: '/genes/:geneId',
			templateUrl: 'modules/genes/views/view-gene.client.view.html'
		}).
		state('editGene', {
			url: '/genes/:geneId/edit',
			templateUrl: 'modules/genes/views/edit-gene.client.view.html'
		});
	}
]);
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
				geneId: $stateParams.geneId
			});
		};
	}
]);
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
'use strict';

//Genes service used to communicate Genes REST endpoints
angular.module('genes').factory('Genes', ['$resource',
	function($resource) {
		return {
            gene: $resource('genes/:geneId', { geneId: '@_id'
    		}, {
    			update: {
    				method: 'PUT'
    			},
                query: {isArray: true}
    		}),
            nctIds: $resource('genes/trials/:nctIds', {nctIds: []}, {get: {isArray: true}})
        };
	}
]);
'use strict';

// Configuring the Articles module
angular.module('mappings',['localytics.directives', 'angular-underscore']).run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mappings', 'mappings', 'dropdown', '/', true, ['*'], -1);
		Menus.addSubMenuItem('topbar', 'mappings', 'Find common trials', 'mappings');
        Menus.addSubMenuItem('topbar', 'mappings', 'Assign trial', 'trials/assign');
		// Menus.addSubMenuItem('topbar', 'mappings', 'New Mapping', 'mappings/create');
	}
]);
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
'use strict';

// Mappings controller
angular.module('mappings').controller('MappingsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Mappings', 'Genes', 'Alterations', 'Cancertypes', 'Drugs', 'Trials',
	function($scope, $stateParams, $location, $window, Authentication, Mappings, Genes, Alterations, CancerTypes, Drugs, Trials) {
		$scope.authentication = Authentication;

		$scope.init = function() {
			initParams();
			geneList();
			altList();
			cancerTypeList();
			drugList();
		};

		$scope.findList = function(group) {
			$scope.selectedGroup = group;
			$scope.trials = Trials.listWithnctIds.search($scope.selectedGroup.nctIds);
			$window.open('#!/mappings/list');
		};
		// Find a list of Mappings
		$scope.find = function() {
		};

		$scope.search = function () {
			var groups = [],
				combined = [];

			groups.push($scope.selectedGene);
			groups.push($scope.selectedAlt);
			groups.push($scope.selectedCancerType);

			groups = $scope.compact(groups);
			combined = combination(groups);

			$scope.trailGroups = combined;
		};

		$scope.example = function() {
			$scope.genes.forEach(function(d){
				if (d.symbol === 'BRAF'){
					$scope.selectedGene = d;
				}
			});
			$scope.alts.forEach(function(d){
				if (d.symbol === 'V600E'){
					$scope.selectedAlt = d;
				}
			});
			$scope.cancerTypes.forEach(function(d){
				if (d.symbol === 'melanoma'){
					$scope.selectedCancerType = d;
				}
			});
			$scope.search();
		};

		$scope.showTrials = function() {
			console.log($scope);
		};

		function combination(array) {
			var len = array.length;
			var n = 1<<len;
			var result = [];
			for(var i=1;i<n;i++)    //从 1 循环到 2^len -1
			{
				var content = {},
					name = [],
					nctIds = [];
				for(var j=0;j<len;j++)
				{
					var temp = i;
					if(temp & (1<<j))   //对应位上为1，则输出对应的字符
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
			}).map(function(e){e.name = e.name.join(', '); return e;});
		}

		function initParams() {
			$scope.selectedGene = '';
			$scope.selectedAlt = '';
			$scope.selectedCancerType = '';
			$scope.selectedGroup = {name: 'NA', nctIds: []};
			$scope.trailGroups = []; //The item should have following structure {name:'', nctIds: []}
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
'use strict';

//Mappings service used to communicate Mappings REST endpoints
angular.module('mappings').factory('Mappings', ['$resource',
	function($resource) {
		return $resource('mappings/:mappingId', { mappingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
	'Drugs',
	function($scope, $stateParams, $location, Authentication, Trials, Genes, Alterations, Cancertypes, Drugs) {
		$scope.authentication = Authentication;
		$scope.nctId = '';

		function syntaxHighlight(json) {
			json = JSON.stringify(json, undefined, 4);
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return '<span class="' + cls + '">' + match + '</span>';
		    });
		}

		$scope.beautify = syntaxHighlight;
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

		// Find existing Trial
		$scope.findOne = function() {
			$scope.trial = Trials.nctId.get({ 
				nctId: $stateParams.nctId
			});
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
	}
]);
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