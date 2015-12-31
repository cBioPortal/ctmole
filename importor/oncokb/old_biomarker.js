/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This file is part of CT-MOLE.
 *
 * CT-MOLE is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';


var mongoose = require('mongoose');
var _ = require('underscore');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model.js');
var	Gene = require('../../app/models/gene.server.model.js');
var	Alteration = require('../../app/models/alteration.server.model.js');
var	Mapping = require('../../app/models/mapping.server.model.js');
var	Trial = require('../../app/models/trial.server.model.js');


var predictedMutations = [];
var flag = 0;
var index = 0, criteriaIndex = 0;
var hugo_symbols = [];
var hugo_symbol;
function connectDB(callback123){

	mongoose.connect('mongodb://localhost/firstDB');
	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	mongoose.connection.once('open', function callback () {
		callback123();
	});
}

function worker3() {
	console.log('\n****************************************************************\n');
	console.log('saving to mapping collection ...');

	var uniquePredictions = [];

	_.each(predictedMutations, function(item){
		var index = uniquePredictions.map(function (e) {
			return e.nctId;
		}).indexOf(item.nctId);

		if(index === -1)
		{
			if(item.alteration === 'unspecified'){
				uniquePredictions.push({nctId: item.nctId, gene: [item.gene]});
			}
			else{
				uniquePredictions.push({nctId: item.nctId, alterationID: [item.alterationID]});
			}
		}
		else
		{
			if(item.alteration === 'unspecified'){
				if(uniquePredictions[index].gene === undefined)
				{
					uniquePredictions[index].gene = [item.gene];
				}
				else
				{
					uniquePredictions[index].gene.push(item.gene);
				}
			}
			else{
				if(uniquePredictions[index].alterationID === undefined)
				{
					uniquePredictions[index].alterationID = [item.alterationID];
				}
				else
				{
					uniquePredictions[index].alterationID.push(item.alterationID);
				}
			}
		}

	});
	var flag3 = 0;
	_.each(uniquePredictions, function(item){

		if(item.gene !== undefined && item.alterationID === undefined){
			Mapping.find({nctId: item.nctId}, function(err, mapping){

				if(mapping.length > 0)
				{
					mapping = mapping[0];
					var preGenes = mapping.predictedGenes;
					if(preGenes === undefined)
					{
						preGenes = [];
					}

					_.each(item.gene, function(newItem){
						preGenes.push({gene: newItem, confirmStatus: 'unconfirmed'});
					});

					Mapping.update({nctId: item.nctId},{$set: {predictedGenes: preGenes}}, function(err, map){
						flag3++;
						console.log('update mapping table ', (flag3/uniquePredictions.length*100).toFixed(2), '% finished');
					});
				}
				else
				{
					var tempArr = [];
					_.each(item.gene, function(newItem){
						tempArr.push({gene: newItem, confirmStatus: 'unconfirmed', type: 'inclusion'});
					});
					var newMappingRecord = new Mapping({nctId: item.nctId, predictedGenes: tempArr, completeStatus: '1'});

					newMappingRecord.save(function(err, map){
						flag3++;
						console.log('save to mapping table ', (flag3/uniquePredictions.length*100).toFixed(2), '% finished');
					});
				}
			})

		}
		else if(item.alterationID !== undefined && item.gene === undefined)
		{
			Mapping.find({nctId: item.nctId}, function(err, mapping){
				if(mapping.length > 0)
				{
					mapping = mapping[0];
					var alteration = mapping.alteration;
					if(alteration === undefined)
					{
						alteration = [];
					}
					_.each(item.alterationID, function(newItem){
						alteration.push({alteration_Id: newItem, status: 'predicted', confirmStatus: 'unconfirmed'});
					});
					Mapping.update({nctId: item.nctId},{$set: {alteration: alteration}}, function(err, map){
						flag3++;
						console.log('update mapping table ', (flag3/uniquePredictions.length*100).toFixed(2), '% finished');
					});
				}
				else
				{
					var tempArr = [];
					_.each(item.alterationID, function(newItem){
						tempArr.push({alteration_Id: newItem, status: 'predicted', confirmStatus: 'unconfirmed', type: 'inclusion'});
					});
					var newMappingRecord = new Mapping({nctId: item.nctId, alteration: tempArr, completeStatus: '1'});

					newMappingRecord.save(function(err, map){
						flag3++;
						console.log('save to mapping table ', (flag3/uniquePredictions.length*100).toFixed(2), '% finished');
					});
				}
			})
		}
		else if(item.alterationID !== undefined && item.gene !== undefined)
		{
			Mapping.find({nctId: item.nctId}, function(err, mapping){
				if(mapping.length > 0)
				{
					mapping = mapping[0];
					var alteration = mapping.alteration;
					if(alteration === undefined)
					{
						alteration = [];
					}
					_.each(item.alterationID, function(newItem){
						alteration.push({alteration_Id: newItem, status: 'predicted', confirmStatus: 'unconfirmed'});
					});

					var preGenes = mapping.predictedGenes;
					if(preGenes === undefined)
					{
						preGenes = [];
					}
					_.each(item.gene, function(newItem){
						preGenes.push({gene: newItem, confirmStatus: 'unconfirmed'});
					});

					Mapping.update({nctId: item.nctId},{$set: {alteration: alteration, predictedGenes: preGenes}}, function(err, map){
						flag3++;
						console.log('update mapping table ', (flag3/uniquePredictions.length*100).toFixed(2), '% finished');
					});
				}
				else
				{
					var tempArr = [], tempArr1 = [];
					_.each(item.alterationID, function(newItem){
						tempArr.push({alteration_Id: newItem, status: 'predicted', confirmStatus: 'unconfirmed', type: 'inclusion'});
					});
					_.each(item.gene, function(newItem){
						tempArr1.push({gene: newItem, confirmStatus: 'unconfirmed'});
					});
					var newMappingRecord = new Mapping({nctId: item.nctId, alteration: tempArr, predictedGenes: tempArr1, completeStatus: '1'});

					newMappingRecord.save(function(err, map){
						flag3++;
						console.log('save to mapping table', (flag3/uniquePredictions.length*100).toFixed(2), '% finished');
					});
				}
			})
		}
	});

}


function worker1(trialIds){
	var firstSearch = true;
	var flagCount = 0;
	var specifiedTrials = [];
	hugo_symbol = hugo_symbols[index];
	Alteration.find({gene: hugo_symbol}, function(err1, alterations){
		if(alterations.length > 0)
		{
			//saved = true;
			_.each(alterations, function(item){

				Trial.find({$and: [{nctId: {$in: trialIds}}, {$text: {$search: '\"' + item.alteration + '\"'}}]} , function(err1, trials1){
					flagCount++;

					if(firstSearch)
					{
						console.log('There are ' + alterations.length + ' mutation records associated with ' + hugo_symbol);
						firstSearch = false;
					}
					if(trials1.length > 0)
					{
						console.log(trials1.length + ' trials found matching the mutation ' + hugo_symbol + ' ' + item.alteration);
						_.each(trials1, function(trialItem){
							predictedMutations.push({nctId: trialItem.nctId, alterationID: item._id.toString()});
							specifiedTrials.push(trialItem.nctId);
						});
					}
					else
					{
						console.log('No trial found matching the mutation ' + hugo_symbol + ' ' + item.alteration);
					}


					if(flagCount === alterations.length)
					{
						_.each(_.difference(trialIds, specifiedTrials), function(trialId){
							predictedMutations.push({nctId: trialId, gene: hugo_symbol, alteration: 'unspecified'});
						});

						index = index + 1;
						if(index === hugo_symbols.length)
						{
							worker3();
						}
						else
						{
							worker2();
						}
					}
				})
			});
		}
		else
		{

			console.log('There are 0 mutation records associated with ' + hugo_symbol);
			_.each(trialIds, function(item){
				predictedMutations.push({nctId: item, gene: hugo_symbol, alteration: 'unspecified'});
			});
			index = index + 1;
			if(index === hugo_symbols.length)
			{
				worker3();
			}
			else
			{
				worker2();
			}
		}


	});
}

function worker2() {
	hugo_symbol = hugo_symbols[index];
	console.log('**************************************');
	console.log('scanning title, purpose and arm group for biomarkers prediction......');
	console.log('**************************************');

	var finalExp = new RegExp(' ' + hugo_symbol + ' ', 'gi');
	Trial.find({$or: [{ title: { $regex: finalExp } },
		{ purpose: { $regex: finalExp } },
		{ arm_group: { $regex: finalExp } }] }, function(err, trials){
		console.log('\n******************************************************************************');
		console.log('Searching for ' + hugo_symbol + ' and there are '+ trials.length + ' trials matching this gene ',((index+1)/hugo_symbols.length*100).toFixed(2), '% finished\n');
		if(trials.length > 0){
			var trialIds = trials.map(function(e){return e.nctId});

			worker1(trialIds);

		}
		else
		{
			index = index + 1;
			if(index === hugo_symbols.length)
			{
				//worker3();
				//begin to scan criteria section for exclusion and inclusion alteration prediction
				worker4();
			}
			else
			{
				worker2();
			}
		}

	})
}

function worker5(){
	var firstSearch = true;
	var flagCount = 0;
	var specifiedTrials = [];
	hugo_symbol = hugo_symbols[criteriaIndex];
	Alteration.find({gene: hugo_symbol}, function(err1, alterations){
		if(alterations.length > 0)
		{
			//saved = true;
			_.each(alterations, function(item){
				var finalExp = new RegExp(' ' + item.alteration + ' ', 'gi');

				Trial.find({$and: [{nctId: {$in: trialIds}}, { eligibilityCriteria: { $regex: finalExp } }]} , function(err1, trials1){
					flagCount++;

					if(firstSearch)
					{
						console.log('There are ' + alterations.length + ' mutation records associated with ' + hugo_symbol);
						firstSearch = false;
					}
					if(trials1.length > 0)
					{
						console.log(trials1.length + ' trials found matching the mutation ' + hugo_symbol + ' ' + item.alteration);
						_.each(trials1, function(trialItem){
							predictedMutations.push({nctId: trialItem.nctId, alterationID: item._id.toString()});
							specifiedTrials.push(trialItem.nctId);
						});
					}
					else
					{
						console.log('No trial found matching the mutation ' + hugo_symbol + ' ' + item.alteration);
					}


					if(flagCount === alterations.length)
					{
						_.each(_.difference(trialIds, specifiedTrials), function(trialId){
							predictedMutations.push({nctId: trialId, gene: hugo_symbol, alteration: 'unspecified'});
						});

						criteriaIndex = criteriaIndex + 1;
						if(criteriaIndex === hugo_symbols.length)
						{
							worker3();
						}
						else
						{
							worker4();
						}
					}
				})
			});
		}
		else
		{

			console.log('There are 0 mutation records associated with ' + hugo_symbol);
			_.each(trialIds, function(item){
				predictedMutations.push({nctId: item, gene: hugo_symbol, alteration: 'unspecified'});
			});
			criteriaIndex = criteriaIndex + 1;
			if(criteriaIndex === hugo_symbols.length)
			{
				worker3();
			}
			else
			{
				worker4();
			}
		}


	});
}

function worker4(){
	hugo_symbol = hugo_symbols[criteriaIndex];
	console.log('**************************************');
	console.log('scanning the eligibility section for biomarkers......');
	console.log('**************************************');

	var finalExp = new RegExp(' ' + hugo_symbol + ' ', 'gi');
	Trial.find({ eligibilityCriteria: { $regex: finalExp } }, function(err, trials){
		console.log('\n******************************************************************************');
		console.log('Searching for ' + hugo_symbol + ' and there are '+ trials.length + ' trials matching this gene ',((criteriaIndex+1)/hugo_symbols.length*100).toFixed(2), '% finished\n');
		if(trials.length > 0){
			var trialIds = trials.map(function(e){return e.nctId});

			worker5(trialIds);

		}
		else
		{
			criteriaIndex = criteriaIndex + 1;
			if(criteriaIndex === hugo_symbols.length)
			{
				worker3();
			}
			else
			{
				worker4();
			}
		}

	})
}


function workers() {
	Gene.find({}, function(err1, genes){

		hugo_symbols = genes.map(function(e){return e.hugo_symbol;});
		worker2();
//adapt worker2 to only search in conditions except than criteria
		//add another worker to search for exclusion alterations
	});

}

function main() {

	connectDB(workers);
}

main();
