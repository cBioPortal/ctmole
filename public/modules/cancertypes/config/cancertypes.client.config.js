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