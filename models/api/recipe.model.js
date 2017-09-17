
var modelLog = "Recipe";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

/*
  Recipe table
*/
exports.addRecipe = function(name, summary, content, imagePath, recipeId, type, authorType, likesNum, temperature, callback){
  var sql = "INSERT INTO recipe (name_sn, summary_mn, content_txt, image_path_ln, recipe_n, type_sn, author_type_sn, hits_n, likes_n, temperature_n) VALUE (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)";

  var sqlParams = [name, summary, content, imagePath, Number(recipeId), type, authorType, Number(likesNum), Number(temperature)];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.loadRecipe =  function(recipeId, callback){
  var sql = "SELECT recipe_id AS recipeId, name_sn AS nameSn, summary_mn AS summary, content_txt AS content, type_sn AS typeSn, author_type_sn AS authorType, recipe_n AS recipeNum, image_path_ln AS imagePath, hits_n AS hitsNum, likes_n AS likesNum, temperature_n AS temperature FROM recipe";

  if(recipeId !== null){
    sql += " WHERE recipe_id = ?"
  }

  var sqlParams = [];

  if(recipeId !== null){
    sqlParams.push(recipeId);
  }

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateRecipe = function(recipeId, name, content, hitsNum, likesNum, callback){
  var sql = "UPDATE recipe SET name_sn = ?, content_txt = ?, hits_n = ?, likes_n = ? WHERE recipe_id = ?";

  var sqlParams = [name, content, hitsNum, likesNum, recipeId];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.removeRecipe = function(recipeId, callback){
  var sql = "DELETE FROM recipe WHERE recipe_id  = ?";

  var sqlParams = [recipeId];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
