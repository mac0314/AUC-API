var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var request = require('request');
var cheerio = require('cheerio');

var ingredientModel = require('../../../models/api/ingredient.model');

var mfpAPI = require('../../../controllers/api/mfp.controller');

/*
  GET

  ingredient data
*/
router.get('/', function(req, res, next) {
  ingredientModel.loadIngredient(function(error, ingredientObject){
    res.json(ingredientObject);
  });
});


/*
  POST

  nutrient data
*/
router.post('/parse/data', function(req, res, next) {
  var foodName = req.body.foodName;
  var foodCode = req.body.foodCode;

  mfpAPI.getNutrient(foodName, foodCode, function(error, resultObject){
    res.json(resultObject);
  });
});

module.exports = router;
