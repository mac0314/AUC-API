
var config = require('config.json')('./config/config.json');

var request = require('request');
var cheerio = require('cheerio');

var ingredientModel = require('../../models/api/ingredient.model');

// www.myfitnesspal.com
exports.getNutrient = function(foodName, foodCode, callback){
  var resultObject = new Object({});

  var url = 'http://www.myfitnesspal.com/ko/food/calories/' + foodCode;

  request({
      url: url,
      method: 'GET'
  }, function (error, response, body) {
      var $ = cheerio.load(body);

      $('ol.fieldset').each(function(){
        var degree = $(this).text().replace(/\s+/g, "").replace(/\n/g, "").replace(/\s+$/g, "").split("1인분: ")[1];

        console.log(degree);

        $('tbody').each(function(){
            var nutrients = $(this).text().replace(/\s+/g, " ").replace(/\n/g, "").replace(/\s+$/g, "");

            console.log(nutrients);

            ingredientModel.addIngredient(foodName, degree, nutrients, function(error, resultObject){
              callback(error, resultObject);
            });

        });

      });

  });
};
