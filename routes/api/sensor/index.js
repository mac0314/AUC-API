var express = require('express');
var router = express.Router();

var sensorModel = require('../../../models/api/sensor.model');

var authMiddleware = require('../../../middlewares/auth');

/*
	GET

	Read sensor.
*/
router.get('/:serialNumber?', function(req, res, next) {
  console.log('get sensor');

  sensorModel.loadSensor(serialNumber, function(error, resultObject){
  	res.json(resultObject);
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

  sensorModel.addSensor(name, description, serialNumber, function(error, resultObject){
  	res.json(resultObject);
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

  console.log("Update sensor");

  sensorModel.updateSensor(sensorId, name, description, serialNumber, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	DELETE

	Delete user.
*/
router.delete('/', function(req, res, next) {
  var sensorId = req.body.sensorId;

	console.log("Delete sensor");

  sensorModel.removeSensor(sensorId, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
