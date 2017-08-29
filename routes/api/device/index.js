var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var deviceModel = require('../../../models/api/device.model');

var authMiddleware = require('../../../middlewares/auth');

/*
	GET

	Read device.
*/
router.get('/', function(req, res, next) {
  console.log('get device');

  deviceModel.loadAllDevice(function(error, deviceObject){
  	res.json(deviceObject);
  });
});


/*
	POST

	Create device.
*/
router.post('/', function(req, res, next) {
  var name = req.body.name;
  var description = req.body.description;
  var serialNumber = req.body.serialNumber;

  console.log("Create device");

  deviceModel.addDevice(name, description, serialNumber, function(error, deviceObject){
  	res.json(deviceObject);
  });
});

/*
	PUT

	Update device.
*/
router.put('/', function(req, res, next) {
  var deviceId = req.body.deviceId;
  var name = req.body.name;
  var description = req.body.description;
  var serialNumber = req.body.serialNumber;

  var resultObject = new Object({});

  console.log("Update device");

  deviceModel.updateDevice(deviceId, name, description, serialNumber, function(error, deviceObject){
    res.json(deviceObject);
  });
});


/*
	DELETE

	Delete user.
*/
router.delete('/', function(req, res, next) {
  var deviceId = req.body.deviceId;

	console.log("Delete device");

  deviceModel.removeDevice(deviceId, function(error, deviceObject){
    res.json(deviceObject);
  });
});


module.exports = router;
