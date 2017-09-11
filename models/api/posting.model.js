
var config = require('config.json')('./config/config.json');

var repositoryModel = require('./repository.model');
var commentModel = require('./comment.model');
var errorModel = require('./error.model');

var dateFormat = require('dateformat');

var async = require('async');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase
});

conn.connect();


var errorPrefix = "postingModel/";


exports.checkPosting = function(categoryName, email, callback){
  console.log("checkPosting");
  var resultObject = new Object({});

  var sql = "SELECT * FROM posting WHERE posting_id IN (SELECT posting_id FROM upload WHERE (category_id IN (SELECT category_id FROM category WHERE name_sn = ?) AND user_id IN (SELECT user_id FROM user WHERE email_mn = ?)))";

  var sqlParams = [categoryName, email];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("selectUserPosting error");
      console.log(error);
      resultObject.error = true;
      resultObject.postingCheck = false;
      resultObject.posting = false;

      var errorTitle = errorPrefix + "selectUserPosting error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      //console.log(result);
      if(result.length > 0){
        resultObject.postingCheck = true;
        resultObject.posting = true;

        callback(null, resultObject);
      }else{
        resultObject.postingCheck = false;
        resultObject.posting = false;

        callback(null, resultObject);
      }

    }
  });
};

exports.loadPosting = function(categoryName, postingId, orient, callback){
  console.log("loadPosting");
  var resultObject = new Object({});

  var sign = orient;
  var order = "ASC";
  switch (sign) {
    case "prev":
      sign = "<";
      order = "DESC";
      break;
    case "current":
      sign = "=";
      break;
    case "next":
      sign = ">";
      break;
    default:
      break;
  }

  var sql = "";
  var categorySql = "";
  var sqlParams = [];

  console.log(categoryName);

  if(categoryName === undefined){
    categorySql = "";
    sqlParams = [Number(postingId)];
  }else{
    categorySql = " AND t.name_sn = ? "
    sqlParams = [Number(postingId), categoryName];
  }

  var sql = "SELECT p.posting_id AS id, t.name_sn AS categoryName, p.image_path_ln AS imagePath, p.thumbnail_path_ln AS thumbnailPath, p.content_txt AS content, p.create_dtm AS createTime, p.update_dtm AS updateTime, p.comment_check AS commentCheck, u.email_mn AS email FROM user AS u, upload AS up, posting AS p, category AS c WHERE u.user_id = up.user_id AND p.posting_id=up.posting_id AND c.category_id = up.category_id AND p.posting_id " + sign + " ? " + categorySql + " ORDER BY p.posting_id " + order + " LIMIT 1";

  //console.log(sql);
  //console.log(sqlParams);

  conn.query(sql, sqlParams, function(error, result, fields){
    if(error){
      console.log("selectPostingAndCategory error");
      console.log(error);
      resultObject.posting = false;

      var errorTitle = errorPrefix + "selectPostingAndcategory error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      //console.log(result);

      if(result.length === 0){
        resultObject.posting = false;
      }else{
        result[0].createTime = dateFormat(result[0].createTime, "yyyy년 mm월 dd일");
        result[0].updateTime = dateFormat(result[0].updateTime, "yyyy년 mm월 dd일");
        resultObject = result[0];
        resultObject.posting = true;
      }

      callback(null, resultObject);
    }
  });

};

exports.loadAllPosting = function(idx, postingNum, callback){
  console.log("loadAllPosting");
  var resultObject = new Object({});

  var sql = "SELECT posting_id AS id, image_path_ln AS imagePath, thumbnail_path_ln AS thumbnailPath, create_dtm AS createTime, update_dtm AS updateTime, comment_check AS commentCheck FROM posting ORDER BY posting_id DESC LIMIT ?, ?";

  var sqlParams = [Number(idx), Number(postingNum)];

  conn.query(sql, sqlParams, function(error, result, fields){
    if(error){
      console.log("selectAllPosting error");
      console.log(error);
      resultObject.postingObject = null;

      var errorTitle = errorPrefix + "selectAllPosting error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      if(result.length === 0){
        resultObject.postingObject = null;
      }else{
        resultObject.postingObject = result;
      }

      callback(null, resultObject);
    }
  });
};


exports.removePosting = function(postingId, callback){
  console.log("removePosting");
  var resultObject = new Object({});

  var sql = "SELECT name_sn AS categoryName, description_ln AS categoryDescription, j1.image_path_ln AS imagePath, j1.thumbnail_path_ln AS thumbnailPath, j1.content_txt AS content, j1.create_dtm AS createTime, j1.update_dtm AS updateTime FROM (SELECT category_id, p.posting_id, image_path_ln, thumbnail_path_ln, content_txt, create_dtm, update_dtm FROM upload AS u JOIN posting AS p ON u.posting_id = p.posting_id WHERE p.posting_id = ?) AS j1 JOIN category AS c ON j1.category_id = c.category_id";

  var sqlParams = [Number(postingId)];

  conn.query(sql, sqlParams, function(error, resultSelectPosting, fields){
    if(error){
      console.log("selectPosting error");
      console.log(error);
      resultObject.load = false;

      var errorTitle = errorPrefix + "selectPosting error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.load = true;
      //console.log(resultSelectPosting);

      if(resultSelectPosting.length > 0){
        var keyArray = [];

        var imagePathArray = resultSelectPosting[0].imagePath.split("auc/");
        var thumbnailPathArray = resultSelectPosting[0].thumbnailPath.split("auc/");

        keyArray.push({Key:imagePathArray[1]});
        keyArray.push({Key:thumbnailPathArray[1]});


        async.waterfall([
          transaction,
          deleteComment,
          deleteUpload,
          deletePosting,
          deleteS3Images
        ], function(error, result){
          if(error){
            console.log("waterfall error");

            var sql = "ROLLBACK";

            conn.query(sql, function(error, resultRollback, fields){
              console.log("rollback");

              resultObject.signup = false;
              resultObject.setting = false;
              resultObject.information = false;
              resultObject.detailInformation = false;

              var errorTitle = errorPrefix + "waterfall error";

              errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                callback(true, resultObject);
              });
            });
          }else{
            console.log("waterfall");

            var sql = "COMMIT";

            conn.query(sql, function(error, resultCommit, fields){
              console.log("commit");
              //console.log(resultCommit);

              resultObject.signup = true;
              resultObject.setting = true;
              resultObject.information = true;
              resultObject.detailInformation = true;

              callback(null, resultObject);
            });
          }
        });

        function transaction(callback){
          var sql = "START TRANSACTION";

          conn.query(sql, function(error, resultTransaction, fields){
            console.log("startTransaction");
            if(error){
              console.log("transaction error");
              console.log(error);
              resultObject.transaction = false;

              var errorTitle = errorPrefix + "transaction error";

              errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                callback(true);
              });
            }else{
              //console.log(result);
              callback(null);
            }
          });
        }

        function deleteComment(callback) {
          var sql = "DELETE FROM comment WHERE posting_id = ?";

          var sqlParams = [postingId];

          conn.query(sql, sqlParams, function(error, resultDeleteComment){
            if(error){
              console.log("Delete comment error");
              console.log(error);
              resultObject.comment = false;

              var errorTitle = errorPrefix + "deleteComment error";

              errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                callback(true);
              });
            }else{
              console.log("deleteComment");
              resultObject.comment = true;
              callback(null);
            }
          });
        }

        function deleteUpload(callback){
          var sql = "DELETE FROM upload WHERE posting_id = ?";

          var sqlParams = [Number(postingId)];

          conn.query(sql, sqlParams, function(error, resultDeleteUpload, fields){
            if(error){
              console.log("deleteUpload error");
              console.log(error);
              resultObject.upload = false;

              var errorTitle = errorPrefix + "deleteUpload error";

              errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                callback(true);
              });
            }else{
              console.log("deleteUpload");
              callback(null);
            }
          });
        }

        function deletePosting(callback){
          var sql = "DELETE FROM posting WHERE posting_id = ?";

          var sqlParams = [Number(postingId)];

          conn.query(sql, sqlParams, function(error, resultDeletePosting, fields){
            if(error){
              console.log("deletePosting error");
              console.log(error);
              resultObject.posting = false;

              var errorTitle = errorPrefix + "deletePosting error";

              errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                callback(true);
              });
            }else{
              console.log("deletePosting");
              callback(null);
            }
          });
        }

        function deleteS3Images(callback){
          repositoryModel.removeS3Images(keyArray, function(error, resultRemove){
            if(error){
              console.log("removeS3Images error");
              console.log(error);
              resultObject.repository = false;

              var errorTitle = errorPrefix + "removeS3Images error";

              errorModel.reportErrorLog(null, errorTitle, error, function(error, result){
                callback(true);
              });
            }else{
              console.log("deleteS3Images");
              callback(null);
            }
          });
        }

      }else{
        console.log("No posting");
        resultObject.posting = false;

        var errorTitle = errorPrefix + "No posting error";

        errorModel.reportErrorLog(null, errorTitle, "No posting - delete", function(error, result){
          callback(true, resultObject);
        });
      }

    }
  });
};
