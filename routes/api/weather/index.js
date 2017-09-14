var express = require('express');
var router = express.Router();

var owmAPI = require('../../../controllers/api/owm.controller');


/*
	GET

	openweathermap API - By geographic coordinates
  https://openweathermap.org/current
*/
router.get('/openweathermap', function(req, res, next) {
  var queryObject = req.query;

  owmAPI.getWeatherByGPS(queryObject, function(error, resultObject){
    res.json(resultObject);
  });
});

module.exports = router;
