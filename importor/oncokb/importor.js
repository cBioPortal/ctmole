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


function readFile(filePath, schema, callback) {
	var documents = [];
	var fs = require('fs'),
    parseString = require('xml2js').parseString;

	fs.readFile(filePath, function(err, data) {
	    parseString(data, {'explicitArray': false, 'attrkey': 'attr', 'charkey': 'text'}, function (err, result) {
	        result.mysqldump.database.table_data.row.forEach(function(e, i){
	        	var datum = {},
	        		data = e.field;

        		for(var key in schema) {
					datum[key] = xmlText(schema[key], data);
				}
			    documents.push(datum);
	        });
	        callback(documents);
	    });
	});
}

function xmlText(dbKey, fieldData) {
	if(fieldData instanceof Array) {
		for (var i = fieldData.length - 1; i >= 0; i--) {
			console.log(fieldData[i].attr);
			if(fieldData[i].attr.name === dbKey) {
				return fieldData[i].text;
			}
		}
		return '';
	}else {
		return null;
	}
}
function connectDB(callback){
	var MongoClient = require('mongodb').MongoClient
  		, assert = require('assert');
	// Connection URL
	var url = 'mongodb://localhost:27017/clinicaltrials-dev';
	// Use connect method to connect to the Server
	require('mongodb').MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
	  	if(typeof callback === 'function') {
	  		callback(db);
	  	}
	});

}

function insertDocuments(collection, documents, callback) {
  	// Drop collection before inserting
  	collection.drop();

  	// Insert some documents
  	collection.insert(documents, function(err, result) {
	    console.log('Inserted.');
	    callback(result);
  	});
}

function main() {
	var queue = {
		// genes: {
		// 	filePath: './data/gene.xml',
		// 	dbSchema: {
		// 		symbol: 'hugo_symbol'
		// 	}
		// },
		// alterations: {
		// 	filePath: './data/alteration.xml',
		// 	dbSchema: {
		// 		symbol: 'alteration',
		// 		name: 'name'
		// 	}
		// },
		cancertypes: {
			filePath: './data/tumor_type.xml',
			dbSchema: {
				symbol: 'name',
				shortName: 'tumor_type_id',
				tissue: 'tissue'
			}
		}
		// drugs: {
		// 	filePath: './data/drug.xml',
		// 	dbSchema: {
		// 		symbol: 'drug_name'
		// 	}
		// }
	};

	var queueKeys = Object.keys(queue);

	connectDB(worker);

	function worker(db) {
		var key = queueKeys.pop();
		if(typeof key !== 'undefined') {
			readFile(queue[key].filePath, queue[key].dbSchema, function(data){
				for (var i = 0; i < data.length; i++) {
					for (var j = i+1; j < data.length; j++) {
						if(data[j].symbol === data[i].symbol) {
							data.splice(j, 1);
						}
					}
				}
				insertDocuments(db.collection(key), data, function(){
					worker(db);
				});
			});
		}else {
			db.close();
		}
	}
}

main();