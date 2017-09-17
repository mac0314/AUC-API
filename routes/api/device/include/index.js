var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var deviceModel = require('../../../../models/api/device.model');


/*
	GET

	Read include.
*/
router.get('/', function(req, res, next) {
  console.log('get include');

  deviceModel.loadInclude(function(error, resultObject){
  	res.json(resultObject);
  });
});

/*
	GET

	Read include.
*/
router.get('/sensor', function(req, res, next) {
  console.log('get include sensor');
  var serialNumber = req.query.serialNumber;

  deviceModel.loadDeviceSensor(serialNumber, function(error, resultObject){
  	res.json(resultObject);
  });
});



/*
	POST

	Create include.
*/
router.post('/', function(req, res, next) {
  var deviceId = req.body.deviceId;
  var sensorId = req.body.sensorId;

  console.log("Create include");

  deviceModel.addInclude(deviceId, sensorId, function(error, resultObject){
  	res.json(resultObject);
  });
});

/*
	PUT

	Update device.
*/
router.put('/', function(req, res, next) {
  var includeId = req.body.includeId;
  var postDeviceId = req.body.postDeviceId;
  var postSensorId = req.body.postSensorId;

  var resultObject = new Object({});

  console.log("Update device");

  deviceModel.updateInclude(includeId, postDeviceId, postSensorId, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	DELETE

	Delete include.
*/
router.delete('/', function(req, res, next) {
  var includeId = req.body.includeId;

	console.log("Delete device");

  deviceModel.removeInclude(includeId, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
