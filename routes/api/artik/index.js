var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var request = require('request');
var cheerio = require('cheerio')

const queryString = require('query-string');

var token = config.artik.token;
/*
	GET

	Artike API - messages
*/
router.get('/messages', function(req, res, next) {
  var url = "https://api.artik.cloud/v1.1/messages?" + queryString.stringify(req.query);

  var resultObject = new Object({});

  var options = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };

  request(options, function (error, response, html) {
    res.json(JSON.parse(response.body));
  });
});

module.exports = router;
