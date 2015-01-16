'use strict';


function rea(filePath, schema, callback) {
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

function update(db) {
	var collectionName = queue.pop();

	if(typeof collectionName !== 'undefined') {
		console.log('-------------', collectionName, '------------');
	  	// Insert some documents
	  	var collection = db.collection(collectionName);

		collection.find({},{'_id':1,'symbol':1}).toArray(function(err, docs) {
			searchNct(db, docs, collectionName, searchNct);
	  	});
  	}else {
  		db.close();
  	}
}

function saveNct(db, _id, nctIds, collectionName) {
	var collection = db.collection(collectionName);
	collection.update({'_id': _id},  { $set: {'nctIds': nctIds} }, function(err,result){
		console.log('\t\tupdated');
	});
}

function searchNct(db, documents, collectionName, callback) {
	var _document = documents.pop();
	if(typeof _document !== 'undefined') {
		var metadata = db.collection('clinicaltrialmetadatas');
		var regex = new RegExp(_document.symbol);
		console.log('\t', _document.symbol);
		metadata.find({
			$or:[
				{'keyword':{$regex: regex}},
				{'condition_browse.mesh_term':{$regex: regex}},
				{'official_title':{$regex: regex}},
				{'intervention.intervention_name':{$regex: regex}},
				{'intervention_browse.mesh_term':{$regex: regex}}
			], 
			'overall_status': 'Recruiting',
			'location_countries.country':{$in:['United States', 'US', 'us', 'america']}
		},{'_id':0, 'id_info.nct_id':1}).toArray(function(err,result){
			var nctIds = [];

			result.forEach(function(e,i) {
				nctIds.push(e.id_info[0].nct_id[0]);
			})
			console.log('\t\tFind', nctIds.length, 'trials.');
			saveNct(db, _document._id, nctIds, collectionName);
			searchNct(db, documents, collectionName, callback);
		});
	}else {
		update(db);
	}
}

function main() {
	connectDB(update);
}

var queue = ['drugs', 'genes','alterations','cancertypes'];
main();