var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var express = require('express'),
    bodyParser = require('body-parser'),
	port = process.env.PORT || 5000;
var app = express();

MongoClient.connect('mongodb://localhost:27017/express-test', function (err, db) {
	if (err) throw err;
	var list = db.collection('list');

	app.use(express.static(__dirname + '/app'));
	app.use(bodyParser.json());

	app.get('/items', function (req, res) { 
		getAll(function (err, results) {
			if (err) return err;
			return res.json(results);
		});
	});
	app.post('/items', function (req,res) {
		var item = req.body;
		list.insert(item, function (err, result) { 
			if (err) throw err; 
			getAll(function (err, results) {
				if (err) return err;
				return res.json(results);
			});
		});
	});
	app.put('/items/:id', function (req,res) { 
		var id = new ObjectID(req.params.id);
		var old = { '_id': id };
		var data = req.body.text;
		list.update(old, {$set: {text: data}}, function (err, result) {
			if (err) throw err;
			getAll(function (err, results) {
				if(err) return err;
				return res.json(results);
			})
		})
	});
	app.delete('/items/delete/:id', function (req,res) {
		var id = new ObjectID(req.params.id);
		var item = { '_id': id };
		list.remove(item, function (err, result) {
			if (err) throw err;
			getAll(function (err, results) {
				if (err) return err;
				return res.json(results);
			});
		});
	});
	app.get('*', function(req,res) {
		res.sendfile('./app/index.html');
	});

	function getAll (callback) {
		list.find().toArray(function (err, items) {
			if (err) return callback(err, null);
			callback(err, items);
		});
	}

	app.listen(port, function() {
	    console.log("Listening on " + port);
	});
});

