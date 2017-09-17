

var config = require('config.json')('./config/config.json');

var request = require('request');

var queryString = require('query-string');

var redis = require("redis");
var redisClient = redis.createClient(config.redis.port, config.redis.host);
//redisClient.auth(config.redis.password);

var recipeModel = require('../../models/api/recipe.model');

var token = config.openweathermap.token;


// openweathermap
exports.getWeatherByGPS = function getWeatherByGPS(queryObject, callback){
  var resultObject = new Object({});
  queryObject.appid = token;
  var url = "http://api.openweathermap.org/data/2.5/weather?" + queryString.stringify(queryObject);

  request(url, function (error, response, html) {
    resultObject.load = true;
    var data = JSON.parse(response.body);

    var weather = data.weather.main;

    var key = "";

    if(weather === "Clear"){
      key = "recipe/smoothy/id";
    }else{
      key = "recipe/dish/id";
    }

    redisClient.smembers(key, function(error, idObject){
      var recommandId = Math.floor(Math.random() * idObject.length);

      recipeModel.loadRecipe(idObject[recommandId], function(error , recipeObject){
        resultObject.recipe = recipeObject;

        callback(null, resultObject);
      });
    });
  });
};
