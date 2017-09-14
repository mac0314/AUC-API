var express = require('express');
var router = express.Router();

var artikAPI = require('../../../controllers/api/artik.controller');

/*
	GET

	Artike API - messages
*/
router.get('/messages', function(req, res, next) {
  var queryObject = req.query;

  artikAPI.getMessage(queryObject, function(error, resultObject){
    res.json(resultObject);
  });
});

module.exports = router;
