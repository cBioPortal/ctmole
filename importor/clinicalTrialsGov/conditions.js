var request = require('request');
var parseString = require('xml2js').parseString;
var jsdom = require('jsdom');
var colors = require('colors');
var mongoose = require('mongoose');
var fs = require('fs');

main();


function main(){
	fs.readFile('conditions.txt', 'utf8', function (err, data) {
	  	if (err) throw err;

	  	var conditions = data.split('\n').map(function(e){
	  		return e.trim();
	  	});

	  	var numOfConditions = 0;
	  	conditions.forEach(function(e, i) {
	  		numOfConditions += Number(e);
	  	})
	  	console.log(numOfConditions);
	});
}