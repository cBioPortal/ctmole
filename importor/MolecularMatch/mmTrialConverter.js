/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var request = require('request');
var mongoose = require('mongoose');
var _ = require('underscore');

var MMTrial = require('../../app/models/mmtrial.server.model.js');
var Trial = require('../../app/models/trials.server.model.js');
var pageIndex = 0, totalPages = 0, trials, mmTrial, lastPageTrialsCount;

function main() {
    mongoose.connect('mongodb://localhost/firstDB');
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function () {
        console.log('Done connecting and begin to convert mm trials...');
        convertTrials();
    });
}
 
function convertTrials() {
    var trial;
    MMTrial.find().stream()
        .on('data', function (mmTrial) {
            trial = new Trial({nctId: mmTrial.id});
        })
        .on('error', function () {
            console.log('error happened when searching valid status trials ');
        })
        .on('end', function () {});
}