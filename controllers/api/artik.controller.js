
var config = require('config.json')('./config/config.json');

var request = require('request');

var queryString = require('query-string');

var token = config.artik.token;

// artik cloud
exports.getMessage = function(queryObject, callback){
  var resultObject = new Object({});
  var url = "https://api.artik.cloud/v1.1/messages?" + queryString.stringify(queryObject);

  var options = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };

  request(options, function (error, response, html) {
    resultObject.data = JSON.parse(response.body);
    callback(null, resultObject);
  });

};
