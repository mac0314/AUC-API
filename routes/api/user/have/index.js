var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var userModel = require('../../../../models/api/user.model');


/*
	GET

	Read have.
*/
router.get('/:email?', function(req, res, next) {
  var email = req.params.email || null;
  console.log('get have');

  userModel.loadHaveByEmail(email, function(error, resultObject){
    res.json(resultObject);
  });

});


/*
	POST

	Admin create have.
*/
router.post('/', function(req, res, next) {
  var userId = req.body.userId;
  var deviceId = req.body.deviceId;

  userModel.addHaveId(userId, deviceId, function(error, resultObject){
  	res.json(resultObject);
  });
});


/*
	POST

	User create have.
*/
router.post('/serial', function(req, res, next) {
  var email = req.body.email;
  var serialNumber = req.body.serialNumber;

  userModel.addHaveSerial(email, serialNumber, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	PUT

	Update have.
*/
router.put('/id', function(req, res, next) {
  var haveId = req.body.haveId;
  var postUserId = req.body.postUserId;
  var postDeviceId = req.body.postDeviceId;

  var resultObject = new Object({});

  console.log("Update have");

  userModel.updateHave(haveId, postUserId, postDeviceId, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	DELETE

	Delete have.
*/
router.delete('/', function(req, res, next) {
  var haveId = req.body.haveId;

	console.log("Delete have");

  userModel.removeHave(haveId, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
