'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ClinicalTrialMetaData = mongoose.model('ClinicalTrialMetaData');

/**
 * Globals
 */
var user, clinicalTrialMetaData;

/**
 * Unit tests
 */
describe('Clinical trial meta data Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			clinicalTrialMetaData = new ClinicalTrialMetaData({
				// Add model fields
				// ...
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return clinicalTrialMetaData.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ClinicalTrialMetaData.remove().exec();
		User.remove().exec();

		done();
	});
});