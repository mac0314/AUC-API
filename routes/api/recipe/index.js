var express = require('express');
var router = express.Router();

var recipeModel = require('../../../models/api/recipe.model');
var nucAPI = require('../../../controllers/api/nuc.controller');

/*
	POST

	create recipe
*/
router.post('/', function(req, res, next) {
  var name = req.body.name;
  var summary = req.body.summary || "";
  var content = req.body.content;
  var imagePath = req.body.imagePath || "";
  var recipeId = req.body.recipeId || -1;
  var type = req.body.type || "스무디";
  var authorType = req.body.authorType || "user";
  var likesNum = req.body.likesNum || 0;
  var temperature = req.body.temperature || 25;

  recipeModel.addRecipe(name, summary, content, imagePath, recipeId, type, authorType, likesNum, temperature, function(error, resultObject){
    res.json(resultObject);
  });
});

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


/*
	PUT

	Update sensor.
*/
router.put('/', function(req, res, next) {
  var recipeId = req.body.recipeId;
  var name = req.body.name;
  var content = req.body.content;
  var hitsNum = req.body.hitsNum;
  var likesNum = req.body.likesNum;

  console.log("Update sensor");

  recipeModel.updateRecipe(recipeId, name, content, hitsNum, likesNum, function(error, resultObject){
    res.json(resultObject);
  });
});


/*
	DELETE

	Delete user.
*/
router.delete('/', function(req, res, next) {
  var recipeId = req.body.recipeId;

	console.log("Delete sensor");

  recipeModel.removeRecipe(recipeId, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
