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