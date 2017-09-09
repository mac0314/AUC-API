
var config = require('config.json')('./config/config.json');

var modelLog = "UserInform";
var errorModel = require('./error.model');
var errorPrefix = "userInformModel/";

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase
});

conn.connect();


exports.loadAllUserInform =  function(callback){
  var log = "loadAll" + modelLog;
  console.log(log);

  var resultObject = new Object({});

  var sql = "SELECT * FROM user AS u, user_information AS i WHERE u.user_id = i.user_id";

  conn.query(sql, function(error, resultLoad){
    if(error){
      var logSummary = log + "error";
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

exports.loadUserInform =  function(email, callback){
  var log = "load" + modelLog;
  console.log(log);

  var resultObject = new Object({});

  var sql = "SELECT * FROM user AS u, user_information AS i WHERE u.user_id = i.user_id and u.email_mn = ?";

  var sqlParams = [email];

  conn.query(sql, sqlParams, function(error, resultLoad){
    if(error){
      var logSummary = log + "error";
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

exports.updateUserInform = function(email, nickname, introduction, profilePath, callback){
  var log = "update" + modelLog;
  console.log(log);

  var resultObject = new Object({});

  var sql = "UPDATE user_information SET nickname_sn = ?, introduction_mn = ?, profile_path_ln = ? WHERE user_id = (SELECT user_id FROM user WHERE email_mn = ?)";

  var sqlParams = [nickname, introduction, profilePath, email];

  conn.query(sql, sqlParams, function(error, resultUpdate){
    if(error){
      var logSummary = "update" + modelLog+ " error";
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
