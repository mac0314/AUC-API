
var modelLog = "UserInform";
var errorModel = require('./error.model');

var queryModel = require('./query.model');


exports.loadAllUserInform =  function(callback){
  var sql = "SELECT * FROM user AS u, user_information AS i WHERE u.user_id = i.user_id";

  var sqlParams = [];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.loadUserInform =  function(email, callback){
  var sql = "SELECT * FROM user AS u, user_information AS i WHERE u.user_id = i.user_id and u.email_mn = ?";

  var sqlParams = [email];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateUserInform = function(email, nickname, introduction, profilePath, callback){
  var sql = "UPDATE user_information SET nickname_sn = ?, introduction_mn = ?, profile_path_ln = ? WHERE user_id = (SELECT user_id FROM user WHERE email_mn = ?)";

  var sqlParams = [nickname, introduction, profilePath, email];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
