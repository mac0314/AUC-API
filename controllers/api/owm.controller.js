

var config = require('config.json')('./config/config.json');

var request = require('request');

var queryString = require('query-string');

var token = config.openweathermap.token;


// openweathermap
exports.getWeatherByGPS = function getWeatherByGPS(queryObject, callback){
  var resultObject = new Object({});
  queryObject.appid = token;
  var url = "http://api.openweathermap.org/data/2.5/weather?" + queryString.stringify(queryObject);

  request(url, function (error, response, html) {
    resultObject.load = true;
    resultObject.data = JSON.parse(response.body);
    callback(null, resultObject);
  });
};
