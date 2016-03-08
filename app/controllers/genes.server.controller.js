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

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Gene = mongoose.model('Gene'),
	_ = require('lodash');

var fs = require('fs'), readline = require('readline');

/**
 * Create a Gene
 */
exports.create = function(req, res) {
	var gene = new Gene(req.body);
	gene.user = req.user;

	gene.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gene);
		}
	});
};

/**
 * Show the current Gene
 */
exports.read = function(req, res) {
	res.jsonp(req.gene);
};

/**
 * Show the current Gene
 */
exports.readGenes = function(req, res) {
	res.jsonp(req.genes);
};

/**
 * Update a Gene
 */
exports.update = function(req, res) {
	var gene = req.gene ;

	gene = _.extend(gene , req.body);

	gene.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gene);
		}
	});
};

/**
 * Delete an Gene
 */
exports.delete = function(req, res) {
	var gene = req.gene ;

	gene.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gene);
		}
	});
};

/**
 * List of Genes
 */
exports.list = function(req, res) { Gene.find({},{hugo_symbol:1}).exec(function(err, genes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(genes);
		}
	});
};

/**
 * Gene middleware
 */
exports.geneByID = function(req, res, next, symbol) { Gene.findOne({'symbol': symbol}).populate('user', 'displayName').exec(function(err, gene) {
		if (err) return next(err);
		if (! gene) return next(new Error('Failed to load Gene ' + symbol));
		req.gene = gene ;
		next();
	});
};

/**
 * Gene middleware
 */
exports.geneByNctIds = function(req, res, next, ids) {

	if(!(ids instanceof Array)) {
		ids = [ids];
	}
	Gene.find({nctIds: {$in: ids}},{'_id':0,'symbol':1}).populate('user', 'displayName').exec(function(err, genes) {
		if (err) return next(err);
		if (! genes) return next(new Error('Failed to load Gene ' + ids));
		req.genes = genes ;
		next();
	});
};


/**
 * Gene middleware
 */
exports.geneByNctId = function(req, res, next, ids) {

	if(!(ids instanceof Array)) {
		ids = [ids];
	}
	Gene.find({nctIds: {$in: ids}},{'_id':0,'symbol':1}).populate('user', 'displayName').exec(function(err, genes) {
		if (err) return next(err);
		if (! genes) return next(new Error('Failed to load Gene ' + ids));
		req.genes = genes ;
		next();
	});
};
/**
 * Gene authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gene.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.getAlias = function(req, res){

	var geneAlias = [];
	var rd = readline.createInterface({
		input: fs.createReadStream(process.cwd() + '/importor/oncokb/geneAlias.txt'),
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
		geneAlias.sort(compare);
		res.jsonp(geneAlias);
	});
}

exports.getskipItems = function(req, res){

	var rd = readline.createInterface({
		input: fs.createReadStream(process.cwd() + '/importor/oncokb/skipItems.txt'),
		output: process.stdout,
		terminal: false
	});

	var skipItems = [];
	rd.on('line', function(line) {
		skipItems.push(line);

	});

	rd.on('close', function(){
		skipItems.sort();
		res.jsonp(skipItems);
	});
}


function compare(a, b){
	if(a.gene < b.gene)
	return -1;
	else if(a.gene > b.gene)
	return 1;
	else
	return 0;
}


exports.assignRule = function(req, res){
	var type = req.params.type, operation = req.params.operation, values = req.params.values.split(","), fileName = '';
	if(type === 'alias'){
		fileName = process.cwd() + '/importor/oncokb/geneAlias.txt';
		if(operation === 'add'){
			fs.appendFile(fileName, values[0] + '\t' + values[1] + '\n' , function (err) {
				return console.log(err);
			});

		}else if(operation === 'delete'){


			fs.readFile(fileName, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var newData = data.replace(values[0] + '\t' + values[1] + '\n', "");
				fs.writeFile(fileName, newData, function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log("The file was saved!");
					}
				});

			});


		}else if(operation === 'edit'){
			fs.readFile(fileName, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var newData = data.replace(values[0] + '\t' + values[1], values[0] + '\t' + values[2]);
				fs.writeFile(fileName, newData, function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log("The file was saved!");

					}
				});

			});
		}

	}else if(type === 'skip'){
		fileName = process.cwd() + '/importor/oncokb/skipItems.txt';

		console.log('gadsfahjgdadfafgdfg', values);

		if(operation === 'add'){
			fs.appendFile(fileName, values[0] + '\n' , function (err) {
				return console.log(err);
			});
		}else if(operation === 'delete'){

			fs.readFile(fileName, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var newData = data.replace(values[0]+ '\n', "");
				fs.writeFile(fileName, newData, function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log("The file was saved!");
					}
				});

			});

		}else if(operation === 'edit'){
			fs.readFile(fileName, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var newData = data.replace(values[0], values[1]);
				fs.writeFile(fileName, newData, function(err) {
					if(err) {
						console.log(err);
					} else {
						console.log("The file was saved!");
					}
				});

			});
		}
	}
	res.jsonp(true);
}
