'use strict';

(function() {
	// Cancertypes Controller Spec
	describe('Cancertypes Controller Tests', function() {
		// Initialize global variables
		var CancertypesController,
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

			// Initialize the Cancertypes controller.
			CancertypesController = $controller('CancertypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cancertype object fetched from XHR', inject(function(Cancertypes) {
			// Create sample Cancertype using the Cancertypes service
			var sampleCancertype = new Cancertypes({
				name: 'New Cancertype'
			});

			// Create a sample Cancertypes array that includes the new Cancertype
			var sampleCancertypes = [sampleCancertype];

			// Set GET response
			$httpBackend.expectGET('cancertypes').respond(sampleCancertypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cancertypes).toEqualData(sampleCancertypes);
		}));

		it('$scope.findOne() should create an array with one Cancertype object fetched from XHR using a cancertypeId URL parameter', inject(function(Cancertypes) {
			// Define a sample Cancertype object
			var sampleCancertype = new Cancertypes({
				name: 'New Cancertype'
			});

			// Set the URL parameter
			$stateParams.cancertypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cancertypes\/([0-9a-fA-F]{24})$/).respond(sampleCancertype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cancertype).toEqualData(sampleCancertype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cancertypes) {
			// Create a sample Cancertype object
			var sampleCancertypePostData = new Cancertypes({
				name: 'New Cancertype'
			});

			// Create a sample Cancertype response
			var sampleCancertypeResponse = new Cancertypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Cancertype'
			});

			// Fixture mock form input values
			scope.name = 'New Cancertype';

			// Set POST response
			$httpBackend.expectPOST('cancertypes', sampleCancertypePostData).respond(sampleCancertypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cancertype was created
			expect($location.path()).toBe('/cancertypes/' + sampleCancertypeResponse._id);
		}));

		it('$scope.update() should update a valid Cancertype', inject(function(Cancertypes) {
			// Define a sample Cancertype put data
			var sampleCancertypePutData = new Cancertypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Cancertype'
			});

			// Mock Cancertype in scope
			scope.cancertype = sampleCancertypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/cancertypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cancertypes/' + sampleCancertypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cancertypeId and remove the Cancertype from the scope', inject(function(Cancertypes) {
			// Create new Cancertype object
			var sampleCancertype = new Cancertypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cancertypes array and include the Cancertype
			scope.cancertypes = [sampleCancertype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cancertypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCancertype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cancertypes.length).toBe(0);
		}));
	});
}());