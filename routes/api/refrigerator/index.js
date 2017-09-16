var express = require('express');
var router = express.Router();

var refrigeModel = require('../../../models/api/refrigerator.model');

var authMiddleware = require('../../../middlewares/auth');

var routeLog = "refrigerator";
/*
	GET

	Read refrigerator.
*/
router.get('/:refrigeratorId?', function(req, res, next) {
  var refrigeratorId = req.params.refrigeratorId;
  console.log('get ' + routeLog);

  refrigeModel.loadAllRefrigerator(function(error, resultObject){
  	res.json(resultObject);
  });
});


/*
	POST

	Create refrigerator.
*/
router.post('/', function(req, res, next) {
  var name = req.body.name;
  var brand = req.body.brand || "";
  var variety = req.body.variety || "";
  var location = req.body.location || "";
  console.log("Create " + routeLog);


  refrigeModel.addRefrigerator(name, brand, variety, location, function(error, resultObject){
  	res.json(resultObject);
  });
});

/*
	PUT

	Update refrigerator.
*/
router.put('/', function(req, res, next) {
  var refrigeratorId = req.body.refrigeratorId;
  var name = req.body.name;
  var brand = req.body.brand || "";
  var variety = req.body.variety || "";
  var location = req.body.location || "";

  console.log("Update " + routeLog);

  refrigeModel.updateRefrigerator(name, brand, variety, location, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	DELETE

	Delete refrigerator.
*/
router.delete('/', function(req, res, next) {
  var refrigeratorId = req.body.refrigeratorId;

	console.log("Delete " + routeLog);

  refrigeModel.removeRefrigerator(refrigeratorId, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
