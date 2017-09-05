var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var request = require('request');

const queryString = require('query-string');

var token = config.openweathermap.token;
/*
	GET

	openweathermap API - By geographic coordinates
  https://openweathermap.org/current
*/
router.get('/openweathermap', function(req, res, next) {
  var queryObject = req.query;
  queryObject.appid = token;
  var url = "http://api.openweathermap.org/data/2.5/weather?" + queryString.stringify(queryObject);

  request(url, function (error, response, html) {
    res.json(JSON.parse(response.body));
  });
});

module.exports = router;
