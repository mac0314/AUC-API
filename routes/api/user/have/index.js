var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var userModel = require('../../../../models/api/user.model');


/*
	GET

	Read have.
*/
router.get('/', function(req, res, next) {
  console.log('get have');

  userModel.loadHave(function(error, resultObject){
  	res.json(resultObject);
  });
});


/*
	POST

	Create have.
*/
router.post('/', function(req, res, next) {
  var userId = req.body.userId;
  var deviceId = req.body.deviceId;

  console.log("Create have");

  userModel.addHave(userId, deviceId, function(error, resultObject){
  	res.json(resultObject);
  });
});

/*
	PUT

	Update have.
*/
router.put('/', function(req, res, next) {
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
