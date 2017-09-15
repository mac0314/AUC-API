
var modelLog = "Refrigerator";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addRecipe = function(name, description, callback){
  var sql = "INSERT INTO ingredient (name_sn, description_ln) VALUE (?, ?)";

  var sqlParams = [name, description];

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

exports.updateRecipe = function(ingredientId, name, description, callback){
  var sql = "UPDATE ingredient SET name_sn = ?, description_ln = ? WHERE ingredient_id = ?";

  var sqlParams = [name, description, ingredientId];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.removeRecipe = function(ingredientId, callback){
  var sql = "DELETE FROM ingredient WHERE ingredient_id  = ?";

  var sqlParams = [ingredientId];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
