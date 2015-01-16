'use strict';

(function() {
	// Genes Controller Spec
	describe('Genes Controller Tests', function() {
		// Initialize global variables
		var GenesController,
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

			// Initialize the Genes controller.
			GenesController = $controller('GenesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gene object fetched from XHR', inject(function(Genes) {
			// Create sample Gene using the Genes service
			var sampleGene = new Genes({
				name: 'New Gene'
			});

			// Create a sample Genes array that includes the new Gene
			var sampleGenes = [sampleGene];

			// Set GET response
			$httpBackend.expectGET('genes').respond(sampleGenes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.genes).toEqualData(sampleGenes);
		}));

		it('$scope.findOne() should create an array with one Gene object fetched from XHR using a geneId URL parameter', inject(function(Genes) {
			// Define a sample Gene object
			var sampleGene = new Genes({
				name: 'New Gene'
			});

			// Set the URL parameter
			$stateParams.geneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/genes\/([0-9a-fA-F]{24})$/).respond(sampleGene);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gene).toEqualData(sampleGene);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Genes) {
			// Create a sample Gene object
			var sampleGenePostData = new Genes({
				name: 'New Gene'
			});

			// Create a sample Gene response
			var sampleGeneResponse = new Genes({
				_id: '525cf20451979dea2c000001',
				name: 'New Gene'
			});

			// Fixture mock form input values
			scope.name = 'New Gene';

			// Set POST response
			$httpBackend.expectPOST('genes', sampleGenePostData).respond(sampleGeneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gene was created
			expect($location.path()).toBe('/genes/' + sampleGeneResponse._id);
		}));

		it('$scope.update() should update a valid Gene', inject(function(Genes) {
			// Define a sample Gene put data
			var sampleGenePutData = new Genes({
				_id: '525cf20451979dea2c000001',
				name: 'New Gene'
			});

			// Mock Gene in scope
			scope.gene = sampleGenePutData;

			// Set PUT response
			$httpBackend.expectPUT(/genes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/genes/' + sampleGenePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid geneId and remove the Gene from the scope', inject(function(Genes) {
			// Create new Gene object
			var sampleGene = new Genes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Genes array and include the Gene
			scope.genes = [sampleGene];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/genes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGene);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.genes.length).toBe(0);
		}));
	});
}());