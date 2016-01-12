/**
 * Created by jiaojiao on 12/28/15.
 */
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
var fs = require('fs'), readline = require('readline');

var	ClinicalTrialMetadata = require('../../app/models/clinical-trial-metadata.server.model.js');
var	Gene = require('../../app/models/gene.server.model.js');
var	Alteration = require('../../app/models/alteration.server.model.js');
var	Mapping = require('../../app/models/mapping.server.model.js');
var	Trial = require('../../app/models/trial.server.model.js');


var predictedMutations = [];
var index = 0, alterationCollectionIndex = 0, predictedMutationIndex = 0;
var hugo_symbol = '', alt = '', altId = '';
var type = '';
var alterationCollections = [];
var geneAlias = [];
var genesWithAlias = [];

var skipScanItems = ['anti egfr', 'anti-egfr'];


function connectDB(callback123){

    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback () {
        callback123();
    });
}

function workers() {
    Gene.find({}).stream()
        .on('data', function(gene){
            alterationCollections.push({gene: gene.hugo_symbol, alterations: ['mutated', 'mutant', 'aberration']});
        })
        .on('error', function(err){
            console.log('sorry but error occured ', err);
        })
        .on('end', function(){
            worker1();
        });
}

function worker1(){
    var searchIndex = -1;
    var genes = _.map(alterationCollections, function(item){
        return item.gene;
    });
    Alteration.find({}).stream()
        .on('data', function(alt){
            searchIndex = genes.indexOf(alt.gene);
            if(searchIndex !== -1)
            {
               alterationCollections[searchIndex].alterations.push(alt.alteration);
            }
        })
        .on('error', function(err){
            console.log('sorry but error occured ', err);
        })
        .on('end', function(){

            worker3();
        })
}

function worker2(){

    var predictedMutation = predictedMutations[predictedMutationIndex];

    Mapping.findOne({nctId: predictedMutation.nctId}).exec(function(err, mapping){

        if(!_.isNull(mapping)){

            mapping.alterations.push(predictedMutation.alteration);
            Mapping.update({nctId: predictedMutation.nctId}, {$set: {alterations: mapping.alterations}}, function(err){
                if(err)
                {
                    console.log('Error happened when saving new mapping record ', err);
                }
                else
                {
                    if(predictedMutationIndex < predictedMutations.length - 1)
                    {
                        predictedMutationIndex++;
                        if(predictedMutationIndex%100 === 0)
                        {
                            console.log('updating trial...');
                            console.log('Saving to database ', (predictedMutationIndex/predictedMutations.length*100).toFixed(2), '% finished');
                        }

                        worker2();
                    }
                    else
                    {
                        console.log('Done Saving');
                        return true;
                    }
                }
            });
        }
        else{
            var newMappingRecord = new Mapping({nctId: predictedMutation.nctId, completeStatus: '1', alterations: [predictedMutation.alteration]});

            newMappingRecord.save(function(err, newMapping){
                if(err)
                {
                    console.log('Error happened when saving new mapping record ', err);
                }
                else
                {
                    if(predictedMutationIndex < predictedMutations.length - 1)
                    {
                        predictedMutationIndex++;
                        if(predictedMutationIndex%100 === 0)
                        {
                            console.log('saving new trial...');
                            console.log('Saving to database ', (predictedMutationIndex/predictedMutations.length*100).toFixed(2), '% finished');
                        }
                        worker2();
                    }
                    else
                    {
                        console.log('Done Saving');
                        return true;
                    }
                }

            });
        }
    });






}


function worker3()
{
    hugo_symbol = alterationCollections[index].gene;
    var str1 = '', str2 = '', tempStr = '', tempIndex = -1, inclusionAltIndex = -1, exclusionAltIndex = -1, inclusionGeneIndex = -1, exclusionGeneIndex = -1;
    var finalExp, tempStrExp = ' ' + hugo_symbol;
    if(genesWithAlias.indexOf(hugo_symbol) !== -1){
        _.each(geneAlias, function(item){
            if(item.gene === hugo_symbol){
                _.each(item.alias, function(aliasItem){
                    tempStrExp += '| '+aliasItem;
                });

            }
        });
        finalExp = new RegExp(tempStrExp, 'i');
    }
    else
    {
         finalExp = new RegExp(hugo_symbol, 'i');
    }
    if(alterationCollections[index].alterations.length > 0)
    {
        type = 'alteration';
        console.log('Scanning for Alterations... ');
        _.each(alterationCollections[index].alterations, function(item){
            console.log(hugo_symbol + ' ' + item);
        });
    }
    else
    {
        type = 'gene';
        console.log('Scanning for Genes...');
        console.log(hugo_symbol);
    }


    Trial.find({$text: {$search: '\"' + hugo_symbol + '\"'}}).stream()
        .on('data', function(trial){

                tempIndex = trial.eligibilityCriteria.search(/Exclusion Criteria:/i);
                tempStr = trial.eligibilityCriteria.substr(0, tempIndex);

                str1 = trial.title + trial.purpose + JSON.stringify(trial.arm_group) + tempStr;
                str2 = trial.eligibilityCriteria.substr(tempIndex);
                //remove special vocabualry from search
                _.each(skipScanItems, function(skipScanItem){
                    var tempRegex = new RegExp(skipScanItem, 'gi');
                    str1 = str1.replace(tempRegex, '');
                    str2 = str2.replace(tempRegex, '');
                });
                inclusionGeneIndex = str1.search(finalExp);
                exclusionGeneIndex = str2.search(finalExp);

                if(type === 'alteration') {
                    var saveGeneInclusionFlag = true, saveGeneExclusionFlag = true;

                    for(var alterationCollectionIndex = 0; alterationCollectionIndex < alterationCollections[index].alterations.length; alterationCollectionIndex++)
                    {
                        alt = alterationCollections[index].alterations[alterationCollectionIndex];
                        var regExp = new RegExp(hugo_symbol + '.*.' + alt + '|' + alt + '.*.' + hugo_symbol, 'i');

                        inclusionAltIndex = str1.search(regExp);
                        exclusionAltIndex = str2.search(regExp);

                        if (inclusionAltIndex !== -1) {
                            predictedMutations.push({
                                nctId: trial.nctId,
                                alteration: {gene: hugo_symbol, alteration: alt, status: 'unconfirmed', type: 'inclusion', curationMethod: 'predicted'}
                            });
                            saveGeneInclusionFlag = false;
                        }

                        if (exclusionAltIndex !== -1) {
                            predictedMutations.push({
                                nctId: trial.nctId,
                                alteration: {gene: hugo_symbol, alteration: alt, status: 'unconfirmed', type: 'exclusion', curationMethod: 'predicted'}
                            });
                            saveGeneExclusionFlag = false;
                        }
                    }

                    if (inclusionGeneIndex !== -1 && saveGeneInclusionFlag === true) {
                        predictedMutations.push({
                            nctId: trial.nctId,
                            alteration: {gene: hugo_symbol, alteration: 'unspecified', status: 'unconfirmed', type: 'inclusion', curationMethod: 'predicted'}
                        });
                    }

                    if (exclusionGeneIndex !== -1 && saveGeneExclusionFlag === true) {
                        predictedMutations.push({
                            nctId: trial.nctId,
                            alteration: {gene: hugo_symbol, alteration: 'unspecified',status: 'unconfirmed', type: 'exclusion', curationMethod: 'predicted'}
                        });
                    }


                }

               if(type === 'gene')
               {
                   if(inclusionGeneIndex !== -1)
                   {
                       predictedMutations.push({nctId: trial.nctId, alteration: {gene: hugo_symbol, alteration: 'unspecified', status: 'unconfirmed', type: 'inclusion', curationMethod: 'predicted'}});
                   }

                   if(exclusionGeneIndex !== -1)
                   {
                       predictedMutations.push({nctId: trial.nctId, alteration: {gene: hugo_symbol, alteration: 'unspecified', status: 'unconfirmed', type: 'exclusion', curationMethod: 'predicted'}});
                   }
               }

                //if(trial.nctId === 'NCT02448810' && hugo_symbol === 'NRAS'){
                //    console.log('NCT0244sadafdfafd8810', type, exclusionGeneIndex, tempStrExp);
                //}

        })
        .on('error', function(){

        })
        .on('end', function(){
            index++;
            if(index < alterationCollections.length-1)
            {
                console.log('**************************************');
                console.log('Bio-Marker Predicting ', (index/alterationCollections.length*100).toFixed(2), '% finished');
                worker3();
            }
            else
            {
                console.log('**************************************');
                console.log('Bio-Marker Predicting is done, Saving to database...');
                console.log('here is the length ', predictedMutations.length);

                worker2();

            }
        })
}

function worker4() {
    var rd = readline.createInterface({
        input: fs.createReadStream('./geneAlias.txt'),
        output: process.stdout,
        terminal: false
    });

    var tempArr = [], tempIndex = -1;
    rd.on('line', function(line) {
        tempArr = line.split('\t');
        tempIndex = -1;
        for(var i = 0;i < geneAlias.length;i++){
            if(geneAlias[i].gene === tempArr[0]){
                tempIndex = i;
                break;
            }
        }
        if(tempIndex === -1){
            geneAlias.push({gene: tempArr[0], alias: [tempArr[1]] });
        }
        else{
            geneAlias[tempIndex].alias.push(tempArr[1]);
        }

    });

    rd.on('close', function(){
        genesWithAlias = _.map(geneAlias, function(e){return e.gene;});
        connectDB(workers);

    });
}

function main() {
    //generate gene alias array with input file
    worker4();
}

main();
