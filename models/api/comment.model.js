
var config = require('config.json')('./config/config.json');

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase
});

conn.connect();

var errorModel = require('./error.model');

var errorPrefix = "commentModel/";


exports.loadPostingComment = function(postingId, callback){
  console.log("loadPostingComment");
  var resultObject = new Object({});

  var sql = "SELECT c.comment_id AS id, u.email_mn AS email, c.content_txt AS content, c.create_dtm AS createTime, c.update_dtm AS updateTime FROM comment AS c, user AS u WHERE c.user_id = u.user_id AND c.posting_id = ? ORDER BY c.comment_id";

  var sqlParams = [postingId];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("loadPostingComment error");
      console.log(error);

      resultObject.load = false;
      resultObject.commentCheck = false;
      resultObject.commentList = false;

      var errorTitle = errorPrefix + "loadPostingComment error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      //console.log(result);
      resultObject.load = true;

      if(result.length > 0){
        resultObject.commentCheck = true;

        resultObject.commentList = result;


      }else{
        resultObject.commentCheck = false;
        resultObject.commentList = false;

      }


      callback(null, resultObject);
    }
  });
};


exports.addComment = function(postingId, userId, content, callback){
  console.log("addComment");
  console.log(postingId, userId, content);
  var resultObject = new Object({});

  var sql = "INSERT INTO comment (posting_id, user_id, content_txt, create_dtm) VALUE (?, ?, ?, NOW())";

  var sqlParams = [postingId, userId, content];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("addComment error");
      console.log(error);

      resultObject.comment = false;

      var errorTitle = errorPrefix + "addComment error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{

      var time = (new Date).getTime();
      //console.log(result);
      resultObject.comment = true;
      resultObject.id = result.insertId;
      resultObject.content = content;
      resultObject.time = time;


      callback(null, resultObject);
    }
  });
};


exports.removeCommentOwner = function (email, commentId, callback){
  console.log("checkCommentOwner");
  var resultObject = new Object({});

  var sql = "SELECT u.email_mn AS email FROM user AS u, comment AS c WHERE u.user_id = c.user_id AND comment_id = ?";

  var sqlParams = [commentId];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("checkCommentOwner error");
      console.log(error);

      resultObject.check = false;

      var errorTitle = errorPrefix + "checkCommentOwner error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else {
      console.log(result);

      resultObject.check = true;

      if(result.length > 0){
        if(email === result[0].email){
          console.log("owner ok");
          removeComment(commentId, function(error, resultRemove){
            resultObject.remove = true;

            callback(null, resultObject);
          });
        }

      }else{
        resultObject.remove = false;

        callback(null, resultObject);
      }


    }
  });
};

function removeComment(commentId, callback){
  console.log("removeComment");
  var resultObject = new Object({});

  var sql = "DELETE FROM comment WHERE comment_id = ?";

  var sqlParams = [commentId];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("removeComment error");
      console.log(error);

      resultObject.remove = false;

      var errorTitle = errorPrefix + "removeComment error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.remove = true;

      callback(null, resultObject);
    }
  });
}


exports.removeComment = function removeComment(commentId, callback){
  console.log("removeComment");
  var resultObject = new Object({});

  var sql = "DELETE FROM comment WHERE comment_id = ?";

  var sqlParams = [commentId];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("removeComment error");
      console.log(error);

      resultObject.remove = false;

      var errorTitle = errorPrefix + "removeComment error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.remove = true;

      callback(null, resultObject);
    }
  });
};


exports.removeAllComments = function(postingId, callback){
  console.log("removeAllComments");
  var resultObject = new Object({});

  var sql = "DELETE FROM comment WHERE posting_id = ?";

  var sqlParams = [postingId];

  conn.query(sql, sqlParams, function(error, result){
    if(error){
      console.log("removeAllComments error");
      console.log(error);

      resultObject.remove = false;

      var errorTitle = errorPrefix + "removeAllComments error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.remove = true;

      callback(null, resultObject);
    }
  });
};
