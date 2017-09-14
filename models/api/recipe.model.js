
var config = require('config.json')('./config/config.json');

var modelLog = "Recipe";
var errorModel = require('./error.model');
var errorPrefix = "recipeModel/";

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase
});

conn.connect();



exports.addRecipe = function(name, summary, content, imagePath, recipeId, type, likesNum, callback){
  console.log("add" + modelLog);

  var resultObject = new Object({});

  var sql = "INSERT INTO recipe (name_sn, summary_mn, content_txt, image_path_ln, recipe_n, type_sn, hits_n, likes_n) VALUE (?, ?, ?, ?, ?, ?, 0, ?)";

  var sqlParams = [name, summary, content, imagePath, Number(recipeId), type, Number(likesNum)];

  conn.query(sql, sqlParams, function(error, resultInsert){
    if(error){
      var logSummary = "insert " + modelLog + " error";
      console.log(logSummary);
      console.log(error);

      resultObject.insert = false;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.insert = true;
      resultObject.insertId = resultInsert.insertId;

      callback(null, resultObject);
    }
  });
};


exports.loadAllRecipe =  function(callback){
  console.log("loadAll" + modelLog);

  var resultObject = new Object({});

  var sql = "SELECT * FROM recipe";

  conn.query(sql, function(error, resultLoad){
    if(error){
      var logSummary = "loadAll" + modelLog + " error";
      console.log(logSummary);
      console.log(error);

      resultObject.load = false;
      resultObject.data = null;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.load = true;
      resultObject.data = resultLoad;

      callback(null, resultObject);
    }
  });
};

exports.updateRecipe = function(recipeId, name, content, hitsNum, likesNum, callback){
  console.log("update" + modelLog);

  var resultObject = new Object({});

  var sql = "UPDATE recipe SET name_sn = ?, content_txt = ?, hits_n = ?, likes_n = ? WHERE recipe_id = ?";

  var sqlParams = [name, content, hitsNum, likesNum, recipeId];

  conn.query(sql, sqlParams, function(error, resultUpdate){
    if(error){
      var logSummary = "update" + modelLog + " error";
      console.log(logSummary);
      console.log(error);

      resultObject.update = false;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.update = true;

      callback(null, resultObject);
    }
  });
};

exports.removeRecipe = function(recipeId, callback){
  console.log("remove" + modelLog);

  var resultObject = new Object({});

  var sql = "DELETE FROM recipe WHERE recipe_id  = ?";

  var sqlParams = [recipeId];

  conn.query(sql, sqlParams, function(error, resultRemove){
    if(error){
      var logSummary = "remove" + modelLog + " error";
      console.log(logSummary);
      console.log(error);

      resultObject.remove = false;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.remove = true;

      callback(null, resultObject);
    }
  });
};
