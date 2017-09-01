var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var ingredientModel = require('../../models/api/ingredient.model');

/*
  GET

  ingredient data
*/
router.get('/', function(req, res, next) {
  ingredientModel.loadIngredient(function(error, ingredientObject){
    if(error){

    }else{

    }
    res.json(ingredientObject);
  });
});


module.exports = router;
