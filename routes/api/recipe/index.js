var express = require('express');
var router = express.Router();

var recipeModel = require('../../../models/api/recipe.model');
var nucAPI = require('../../../controllers/api/nuc.controller');


/*
	POST

	NUC page recipe
*/
router.post('/:recipeId/:type', function(req, res, next) {
  var recipeId = req.params.recipeId;
  var type = req.params.type;

  nucAPI.requestDataAndSave(recipeId, type, function(error, resultObject){
    res.json(resultObject);
  });
});

/*
  GET

  Recipe data
*/
router.get('/', function(req, res, next) {
  recipeModel.loadAllRecipe(function(error, recipeObject){
    res.json(recipeObject);
  });
});

/*
	POST

	NUC page recipe
*/
router.get('/nuc/:recipeId/:type', function(req, res, next) {
  var recipeId = req.params.recipeId;
  var type = req.params.type;

  nucAPI.requestData(recipeId, type, function(error, resultObject){
    res.json(resultObject);
  });
});

module.exports = router;
