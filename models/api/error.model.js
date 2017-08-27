
var config = require('config.json')('./config/config.json');

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.pipetdatabase
});

conn.connect();

exports.loadUnhandleError = function(userId, callback){
  console.log("loadErrorLog");

  var sql = "";
};


exports.reportErrorLog = function(userId, title, errorLog, callback){
  console.log("reportErrorLog");
  var resultObject = new Object({});

  var sql = "INSERT INTO error (error_title_mn, error_log_txt) VALUE (?, ?)";

  var log = JSON.stringify(errorLog);
  var sqlParams = [title, log];

  conn.query(sql, sqlParams, function(error, resultInsert){
    if(error){
      console.log(error);

    }else{
      if(userId === null){
        resultObject.log = true;

        callback(null, resultObject);
      }else{
        resultObject.log = true;

        var errorId = resultInsert.insertId;

        var sql = "INSERT INTO error (error_id, user_id) VALUE (?, ?)";

        var sqlParams = [errorId, userId];

        conn.query(sql, sqlParams, function(error, result){
          if(error){
            resultObject.occur = false;

            callback(true, resultObject);
          }else{
            resultObject.occur = true;

            callback(null, resultObject);
          }
        });
      }
    }
  });
};


exports.removeErrorLog = function (email, commentId, callback){
  console.log("removeErrorLog");
};

function removeErrorLog(commentId, callback){
  console.log("removeErrorLog");
}
