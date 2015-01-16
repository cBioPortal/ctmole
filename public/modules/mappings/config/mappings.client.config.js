'use strict';

// Configuring the Articles module
angular.module('mappings',['localytics.directives', 'angular-underscore']).run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mappings', 'mappings', 'item', '/mappings', true, ['*'], -1);
		// Menus.addSubMenuItem('topbar', 'mappings', 'List Mappings', 'mappings');
		// Menus.addSubMenuItem('topbar', 'mappings', 'New Mapping', 'mappings/create');
	}
]);