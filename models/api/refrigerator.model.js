
var modelLog = "Refrigerator";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addRefrigerator = function(name, brand, variety, location, callback){
  var sql = "INSERT INTO refrigerator (name_sn, brand_sn, variety_sn, location_ln) VALUE (?, ?, ?, ?)";

  var sqlParams = [name, brand, variety, location];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};


exports.loadAllRefrigerator =  function(callback){
  var sql = "SELECT * FROM refrigerator";

  var sqlParams = [];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateRefrigerator = function(refrigeratorId, name, brand, variety, location, callback){
  var sql = "UPDATE refrigerator SET name_sn = ?, brand_sn, variety_sn, location_ln = ? WHERE refrigerator_id = ?";

  var sqlParams = [name, brand, variety, location, ingredientId];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.removeRefrigerator = function(refrigeratorId, callback){
  var sql = "DELETE FROM refrigerator WHERE refrigerator_id  = ?";

  var sqlParams = [refrigeratorId];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
