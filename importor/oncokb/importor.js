//jiaojiao Nocv/5/2015
//This file is used to update Trial model from ClinicalTrialMetadata



'use strict';


var mongoose = require('mongoose');
var _ = require('underscore');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model.js');
var	Trial = require('../../app/models/trial.server.model.js');


function connectDB(){

	mongoose.connect('mongodb://localhost/firstDB');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	mongoose.connection.once('open', function callback () {
		workers();
	});
}


function workers() {
	ClinicalTrialMetadata.find({}).limit(10).exec(function(err, metadatas) {
		if (err)
		{
			console.log('error happened when searching ClinicalTrialMetadata', err);
		}
		else
		{
			_.each(metadatas, function(metadata){
				console.log(metadata.phase);
				var trialID = metadata.id_info[0].nct_id[0];
				Trial.findOne({nctId: trialID}).exec(function(err1, trial){
					if(err1)
					{
						console.log('error happened when searching Trial', err1);
					}
					else if(_.isNull(trial) )
					{
						console.log('Inserting new trial record ',trialID);
						var drugsNeeded = [];
						_.each(metadata.intervention, function(item){
							drugsNeeded.push(item.intervention_name);
						});

						var trialRecord = new Trial({nctId: trialID,
							title: metadata.brief_title[0],
							purpose: metadata.brief_summary[0].textblock[0],
							recruitingStatus: metadata.overall_status[0],
							eligibilityCriteria: metadata.eligibility[0].criteria[0].textblock[0],
							phase: metadata.phase[0],
							diseaseCondition: metadata.condition_browse[0].mesh_term,
							lastChangedDate: metadata.lastchanged_date[0],
							countries: metadata.location_countries[0].country,
							drugs: drugsNeeded,
							arm_group: metadata.arm_group});


						trialRecord.save(function(err, trail){
							if(err)console.log('Error happened when saving to db', err);
							else console.log('Insert', trialID, ' into db successfully');
						});

					}
					else
					{

						if(metadata.overall_status[0] === trial.recruitingStatus)
						{
							console.log('Trial ', trialID, 'is already updated to the most recent version');
						}
						else
						{
							Trial.update({nctId: trialID},{$set: {phase:'phase tesing...'}}).exec(function (err, trial) {
								if (err) {
									console.log('Error happened when trying to update trial ', trialID);
								} else {
									console.log('Successfully updated trial', trialID);
								}
							});
						}

					}
				});
			});
		}
	});

}

function main() {

	connectDB();
}

main();
