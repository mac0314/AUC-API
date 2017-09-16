var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var request = require('request');
var cheerio = require('cheerio');

var ingredientModel = require('../../../models/api/ingredient.model');

var mfpAPI = require('../../../controllers/api/mfp.controller');

/*
  GET

  Read ingredient data
*/
router.get('/', function(req, res, next) {
  ingredientModel.loadIngredient(function(error, ingredientObject){
    res.json(ingredientObject);
  });
});

/*
  POST

  Create ingredient data
*/
router.post('/', function(req, res, next) {
  var name = req.body.name;
  var degree = req.body.degree;
  var nutrients = req.body.nutrients;

  ingredientModel.addIngredient(name, degree, nutrients, function(error, resultObject){
    res.json(resultObject);
  });
});

/*
  POST

  parse and save ingredient data
*/
router.post('/parse/data', function(req, res, next) {
  var foodName = req.body.foodName;
  var foodCode = req.body.foodCode;

  mfpAPI.getNutrient(foodName, foodCode, function(error, resultObject){
    res.json(resultObject);
  });
});

/*
	PUT

	Update ingredient data.
*/
router.put('/', function(req, res, next) {
  var name = req.body.name;
  var degree = req.body.degree;
  var nutrients = req.body.nutrients;

  ingredientModel.updateIngredient(name, degree, nutrients, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	DELETE

	Delete nutrient data.
*/
router.delete('/', function(req, res, next) {
  var name = req.body.name;

  ingredientModel.removeIngredient(name, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
