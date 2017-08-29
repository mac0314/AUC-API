var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var sensorModel = require('../../../models/api/sensor.model');

var authMiddleware = require('../../../middlewares/auth');

/*
	GET

	Read sensor.
*/
router.get('/', function(req, res, next) {
  console.log('get sensor');
  var resultObject = new Object({});

  sensorModel.loadAllSensor(function(error, sensorObject){
  	res.json(sensorObject);
  });
});


/*
	POST

	Create sensor.
*/
router.post('/', function(req, res, next) {
  var name = req.body.name;
  var description = req.body.description;
  var serialNumber = req.body.serialNumber;

  console.log("Create sensor");

  sensorModel.addSensor(name, description, serialNumber, function(error, sensorObject){
  	res.json(sensorObject);
  });
});

/*
	PUT

	Update sensor.
*/
router.put('/', function(req, res, next) {
  var sensorId = req.body.sensorId;
  var name = req.body.name;
  var description = req.body.description;
  var serialNumber = req.body.serialNumber;

  var resultObject = new Object({});

  console.log("Update sensor");

  sensorModel.updateSensor(sensorId, name, description, serialNumber, function(error, sensorObject){
    res.json(sensorObject);
  });
});


/*
	DELETE

	Delete user.
*/
router.delete('/', function(req, res, next) {
  var sensorId = req.body.sensorId;

	console.log("Delete sensor");

  sensorModel.removeSensor(sensorId, function(error, sensorObject){
    res.json(sensorObject);
  });
});


module.exports = router;
