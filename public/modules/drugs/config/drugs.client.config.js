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