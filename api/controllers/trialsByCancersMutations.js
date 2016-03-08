/**
 * Created by jiaojiao on 3/7/16.
 */
'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
 */

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

 It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

var mongoose = require('mongoose'),
    _ = require('lodash');
var Trial = require('../../app/models/trial.server.model'),
    Mapping = require('../../app/models/mapping.server.model'),
    Cancertype = require('../../app/models/cancertype.server.model');

module.exports = {
    trialsByCancersMutationsGET: trialsByCancersMutationsGET,
    trialsByCancersMutationsPOST: trialsByCancersMutationsPOST
};


function trialsByCancersMutationsGET(req, res) {

    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback () {

        //1: get clinical trials list A from gene and alteration

        //3: get clinical trials list B from cancertype
        //4: return the intersection of A and B as result

        // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
        var gene = req.swagger.params.gene.value.toUpperCase();
        var alteration = req.swagger.params.alteration.value.toUpperCase();
        var tumortype = req.swagger.params.tumortype.value;

        var results = [], nctIdsA = [], nctIdsB = [], nctIds = [];
        Mapping.find({}).stream()
        .on('data',function(item){
            item.alterations.forEach(function(altItem, i){

                if(altItem.gene.toUpperCase() === gene && altItem.alteration.toUpperCase() === alteration){
                    nctIdsA.push(item.nctId);
                }
            });
        })
        .on('error', function(err){
            console.log('Oppos, error happened ', err);
        })
        .on('end', function(){
            nctIdsA = _.uniq(nctIdsA);
            var pattern = new RegExp(tumortype, "i");
            Cancertype.find({OncoKBCancerType: {$regex: pattern}}).exec(function(err, cancertypes){
                _.each(cancertypes, function(cancertype){
                    nctIdsB = nctIdsB.concat(cancertype.nctIds);
                });
                nctIdsB = _.uniq(nctIdsB);
                nctIds = _.intersection(nctIdsA, nctIdsB);console.log( nctIdsA.length, 'd', nctIdsB.length, 'c', nctIds.length);
                results.push({gene: gene, alteration: alteration, tumortype: tumortype, nctIds: nctIds });
                res.json(results);
                mongoose.connection.close();
            });
        })


    });

}

function trialsByCancersMutationsPOST(req, res) {

    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback () {

        //1: get clinical trials list A from gene and alteration

        //3: get clinical trials list B from cancertype
        //4: return the intersection of A and B as result

        // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
        var gene = req.swagger.params.body.value.gene.toUpperCase();
        var alteration = req.swagger.params.body.value.alteration.toUpperCase();
        var tumortype = req.swagger.params.body.value.tumortype.toUpperCase();

        var results = [], nctIdsA = [], nctIdsB = [], nctIds = [];
        Mapping.find({}).stream()
            .on('data',function(item){
                item.alterations.forEach(function(altItem, i){

                    if(altItem.gene.toUpperCase() === gene && altItem.alteration.toUpperCase() === alteration){
                        nctIdsA.push(item.nctId);
                    }
                });
            })
            .on('error', function(err){
                console.log('Oppos, error happened ', err);
            })
            .on('end', function(){
                nctIdsA = _.uniq(nctIdsA);
                var pattern = new RegExp(tumortype, "i");
                Cancertype.find({OncoKBCancerType: {$regex: pattern}}).exec(function(err, cancertypes){
                    _.each(cancertypes, function(cancertype){
                        nctIdsB = nctIdsB.concat(cancertype.nctIds);
                    });
                    nctIdsB = _.uniq(nctIdsB);
                    nctIds = _.intersection(nctIdsA, nctIdsB);console.log( nctIdsA.length, 'd', nctIdsB.length, 'c', nctIds.length);
                    results.push({gene: gene, alteration: alteration, tumortype: tumortype, nctIds: nctIds });
                    res.json(results);
                    mongoose.connection.close();
                });
            })


    });

}

