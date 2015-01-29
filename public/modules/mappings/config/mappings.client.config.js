'use strict';

// Configuring the Articles module
angular.module('mappings',['localytics.directives', 'angular-underscore'])
.constant('Venn', venn)
.constant('D3', d3)
.run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mappings', 'mappings', 'dropdown', '/', true, ['*'], -1);
		Menus.addSubMenuItem('topbar', 'mappings', 'Find common trials', 'mappings');
        Menus.addSubMenuItem('topbar', 'mappings', 'Assign trial', 'trials/assign');
		// Menus.addSubMenuItem('topbar', 'mappings', 'New Mapping', 'mappings/create');
	}
]);