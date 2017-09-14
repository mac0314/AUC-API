
var express = require('express');
var router = express.Router();

var openDataAPI = require('../../../controllers/api/opendata.controller');

/*
  GET

  nutrient data
*/
router.get('/:ingredient?', function(req, res, next) {
  var ingredient = req.params.ingredient || "";

  openDataAPI.getNutrient(ingredient, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
