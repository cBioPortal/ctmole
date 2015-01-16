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