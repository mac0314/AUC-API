
var modelLog = "Recipe";
var errorModel = require('./error.model');


exports.addRecipe = function(name, summary, content, imagePath, recipeId, type, likesNum, callback){
  var sql = "INSERT INTO recipe (name_sn, summary_mn, content_txt, image_path_ln, recipe_n, type_sn, hits_n, likes_n) VALUE (?, ?, ?, ?, ?, ?, 0, ?)";

  var sqlParams = [name, summary, content, imagePath, Number(recipeId), type, Number(likesNum)];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};


exports.loadAllRecipe =  function(callback){
  var sql = "SELECT * FROM recipe";

  var sqlParams = [];

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
