/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var request = require('request');
var mongoose = require('mongoose');
var _ = require('underscore');
 
var Mapping = require('../../app/models/mapping.server.model.js');
 

function main() {
    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function () {
        console.log('Done connecting and begin to fetch trials info...');
        var nctIds = [];
        Mapping.find({}, {nctId:1, alterations: 1}).stream()
                .on('data', function(mapping){
                    if(mapping.alterations !== undefined && mapping.alterations.length > 0){
                        _.each(mapping.alterations, function(item){
                            if(item.gene === 'ERBB2')
                            {  
                                nctIds.push(mapping.nctId);
                            }
                        });
                    }
                })
                .on('error', function(error){
                    
                })
                .on('end', function(){
                    nctIds = _.uniq(nctIds);
                    console.log('here is the final result ', nctIds.length);
                });
                
    });
}

main();