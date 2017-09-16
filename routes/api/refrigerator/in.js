var express = require('express');
var router = express.Router();

var refrigeModel = require('../../../models/api/refrigerator.model');

var authMiddleware = require('../../../middlewares/auth');

var routeLog = "In";
/*
	GET

	Read in.
*/
router.get('/:inId?', function(req, res, next) {

});


/*
	POST

	Create in.
*/
router.post('/', function(req, res, next) {

});

/*
	PUT

	Update in.
*/
router.put('/', function(req, res, next) {

});


/*
	DELETE

	Delete in.
*/
router.delete('/', function(req, res, next) {

});


module.exports = router;
