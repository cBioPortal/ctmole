'use strict';

(function() {
	// Mappings Controller Spec
	describe('Mappings Controller Tests', function() {
		// Initialize global variables
		var MappingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Mappings controller.
			MappingsController = $controller('MappingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mapping object fetched from XHR', inject(function(Mappings) {
			// Create sample Mapping using the Mappings service
			var sampleMapping = new Mappings({
				name: 'New Mapping'
			});

			// Create a sample Mappings array that includes the new Mapping
			var sampleMappings = [sampleMapping];

			// Set GET response
			$httpBackend.expectGET('mappings').respond(sampleMappings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mappings).toEqualData(sampleMappings);
		}));

		it('$scope.findOne() should create an array with one Mapping object fetched from XHR using a mappingId URL parameter', inject(function(Mappings) {
			// Define a sample Mapping object
			var sampleMapping = new Mappings({
				name: 'New Mapping'
			});

			// Set the URL parameter
			$stateParams.mappingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mappings\/([0-9a-fA-F]{24})$/).respond(sampleMapping);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mapping).toEqualData(sampleMapping);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mappings) {
			// Create a sample Mapping object
			var sampleMappingPostData = new Mappings({
				name: 'New Mapping'
			});

			// Create a sample Mapping response
			var sampleMappingResponse = new Mappings({
				_id: '525cf20451979dea2c000001',
				name: 'New Mapping'
			});

			// Fixture mock form input values
			scope.name = 'New Mapping';

			// Set POST response
			$httpBackend.expectPOST('mappings', sampleMappingPostData).respond(sampleMappingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mapping was created
			expect($location.path()).toBe('/mappings/' + sampleMappingResponse._id);
		}));

		it('$scope.update() should update a valid Mapping', inject(function(Mappings) {
			// Define a sample Mapping put data
			var sampleMappingPutData = new Mappings({
				_id: '525cf20451979dea2c000001',
				name: 'New Mapping'
			});

			// Mock Mapping in scope
			scope.mapping = sampleMappingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mappings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mappings/' + sampleMappingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mappingId and remove the Mapping from the scope', inject(function(Mappings) {
			// Create new Mapping object
			var sampleMapping = new Mappings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mappings array and include the Mapping
			scope.mappings = [sampleMapping];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mappings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMapping);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mappings.length).toBe(0);
		}));
	});
}());