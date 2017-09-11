
var randomString = require('./random_string');

var config = require('config.json')('./config/config.json');

var errorModel = require('./error.model');

var async = require('async');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/s3_config.json');

var s3Host = config.s3.host;
var s3BucketName = config.s3.bucket;
var s3Prefix = config.s3.prefix.recipe;

var s3Bucket = new AWS.S3( { params: {Bucket: s3BucketName} } );

const qs = require('querystring');

var multiparty = require('multiparty');
var fs = require('fs');

var gm = require('gm');

var util = require('util');

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase,
  charset : 'utf8mb4'
});

conn.connect();

var errorPrefix = "repositoryModel/";

exports.uploadImage = function(req, callback){
  var resultObject = new Object({});
  var categoryName = "";
  var content = "";
  var commentCheck = "";
  var publicCheck = true;

  console.log("uploadImage");

  var form = new multiparty.Form();

  form.on('field', function(name, value){

  });

  form.on('part', function (part) {

  });

  // all uploads are completed
  form.on('close',function(){

  });

  // track progress
  form.on('progress',function(byteRead, byteExpected){
    //console.log(' Reading total  '+ byteRead + '/' + byteExpected);
  });

  form.on('error', function (err) {
    //console.log('error');
    //handle other error
  });

  form.parse(req, function(error, fields, files){
    console.log(req.files);
    console.log(fields);
    console.log(req.body);
    console.log(files);
    var myFile = files.file[0];

    //email = req.decoded.data.email;
    email = "a@a.a";
    categoryName = fields.categoryName;

    content = fields.content.toString().replace(/\r\n|\r|\n/g, '<br />');
    const check = fields.check;
    //console.log(check);

    if(check === undefined){
      commentCheck = false;
    }else{
      // check[0] = 'on'
      commentCheck = true;
    }
    //console.log(commentCheck);

    var originalFileNameArray = myFile.originalFilename.split(".");

    var categoryEncoded = encodeURIComponent(categoryName);

    console.log(email, categoryName, content, commentCheck);

    var params = {
      Key: 'Path',
  		ACL:'public-read',
      Body: "",
      Metadata: {
          'Content-Type': 'image/jpeg'
      }
    };

    var stringNum = 5;
    var randomWord = randomString.randomString(stringNum);

    var fileName = Date.now() + "-" + randomWord + "." + originalFileNameArray[1];

    var file = fs.createReadStream(myFile.path);
    gm(file)
      .autoOrient()
      .stream(function(error, stdout, stderr){
        //console.log(stdout);

        var buf = new Buffer('');
        stdout.on('data', function(data) {
           buf = Buffer.concat([buf, data]);
        });
        stdout.on('end', function(data) {

          params.Body = buf;

          params.Key = s3Prefix + "/" + categoryName + "/" + fileName;

          //console.log(params.Key);

          resultObject.categoryName = categoryName;
          resultObject.categoryEncoded = categoryEncoded;


          async.parallel({
            image: function(callback){
              s3Bucket.putObject(params, function (error, data) {
                  if (error) {
                      console.log("putObject error");
                      //handle error
                      resultObject.uploadCheck = false;

                      var errorTitle = errorPrefix + "putObject error";

                      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                        callback(true, resultObject);
                      });
                  } else {
                      console.log("putObject");
                      //handle upload complete
                      resultObject.uploadCheck = true;

                      //delete the temp file
                      fs.unlink(myFile.path);
                      callback(null, true);
                  }
              });
            },
            user: function(callback){
              var sql = "SELECT user_id AS id, email_mn AS email, password_ln AS password FROM user WHERE email_mn = ?";
              var sqlParams = [email];

              conn.query(sql, sqlParams, function(error, resultSelectUser, fields){
                if(error){
                  console.log("Error selectUser");
                  console.log(error);
                  resultObject.load = false;
                  errorModel.reportErrorLog(null, errorTitle, error, function(error, result){
                    callback(true, resultObject);
                  });
                }else{
                  var userId = null;

                  if(resultSelectUser.length > 0){
                    resultObject.idError = false;
                    userId = resultSelectUser[0].id;
                  }else{
                    resultObject.idError = true;
                  }

                  var userObject = new Object({});
                  userObject.userId = userId;

                  callback(null, userObject);
                }
              });
            },
            category: function(callback){
              var sql = "SELECT category_id AS id, name_sn AS name, description_ln AS description FROM category WHERE name_sn = ? LIMIT 1";
              var sqlParams = [categoryName];

              conn.query(sql, sqlParams, function(error, resultSelectCategory, fields){
                if(error){
                  console.log("selectCategory error");
                  console.log(error);
                  resultObject.load = false;
                  errorModel.reportErrorLog(null, errorTitle, error, function(error, result){
                    callback(true, resultObject);
                  });
                }else{
                  if(resultSelectCategory.length > 0){
                    var categoryId = resultSelectCategory[0].id;

                    var imagePath = s3Host + "/" + s3BucketName + "/" + params.Key;
                    //var cropPath = s3Host + "/" + s3BucketName + "/" + "resize/l/" + categoryName + "/"+ fileName;
                    var thumbnailPath = s3Host + "/" + s3BucketName + "/" + "resize/s/" + categoryName + "/"+ fileName;

                    var categoryObject = new Object({});

                    categoryObject.categoryId = categoryId;
                    categoryObject.imagePath = imagePath;
                    //categoryObject.cropPath = cropPath;
                    categoryObject.thumbnailPath = thumbnailPath;

                    if(resultObject.idError){
                      //console.log("idError true");

                      callback(true, categoryObject);
                    }else{

                      callback(null, categoryObject);
                    }
                  }else{
                    // No category
                    console.log("No category");
                    resultObject.postingId = false;

                    var errorTitle = errorPrefix + "No category error";

                    errorModel.reportErrorLog(null, errorTitle, "No category", function(error, result){
                      callback(true, null);
                    });
                  }
                }
              });
            }
          }, function(error, results){
            if(error){
              console.log("parallel error");
              console.log(error);

              var errorTitle = errorPrefix + "parallel error";

              errorModel.reportErrorLog(null, errorTitle, error, function(error, result){
                callback(true, null);
              });
            }else{
              console.log("parallel");
              //console.log(results);

              var userId = results.user.userId;
              var categoryId = results.category.categoryId;
              var imagePath = results.category.imagePath;
              //var cropPath = results.category.cropPath;
              var thumbnailPath = results.category.thumbnailPath;
              var postingId = false;

              if(results.image){
                async.waterfall([
                  transaction,
                  insertPosting,
                  insertUpload
                ], function(error, result){
                  if(error){
                    console.log("waterfall error");

                    var sql = "ROLLBACK";

                    conn.query(sql, function(err, resultRollback, fields){
                      console.log("rollback");
                      console.log(error);
                      resultObject.posting = false;

                      var keyArray = [];

                      var imagePathArray = imagePath.split("auc/");
                      //var cropPathArray = cropPath.split("auc/");
                      var thumbnailPathArray = thumbnailPath.split("auc/");

                      keyArray.push({Key:imagePathArray[1]});
                      //keyArray.push({Key:cropPathArray[1]});
                      keyArray.push({Key:thumbnailPathArray[1]});

                      //console.log(keyArray);

                      deleteS3Image(keyArray, function(err, resultRollback){
                        var errorTitle = errorPrefix + "waterfall error";

                        errorModel.reportErrorLog(null, errorTitle, error, function(error, result){
                          callback(true, null);
                        });
                      });

                    });
                  }else{
                    console.log("waterfall");

                    var sql = "COMMIT";

                    conn.query(sql, function(error, resultCommit, fields){
                      console.log("commit");

                      resultObject.posting = true;



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
                      //TODO modify callback
                      callback(true);
                    }else{
                      //console.log(result);
                      callback(null);
                    }
                  });
                }

                function insertPosting(callback){
                  var sql = 'INSERT INTO posting (image_path_ln, thumbnail_path_ln, content_txt, hits_n, update_dtm, comment_check, public_check) VALUE (?, ?, ?, 0, NOW(), ?, ?)';

                  var sqlParams = [imagePath, thumbnailPath, content, commentCheck, publicCheck];

                  conn.query(sql, sqlParams, function (error, resultInsertPosting, fields) {
                    if (error){
                      console.log("insertPosting error");
                      console.log(error);
                      resultObject.insert = false;

                      var errorTitle = errorPrefix + "insertPosting error";

                      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                        callback(true, resultObject);
                      });
                    }else{
                      console.log("insertPosting");

                      postingId = resultInsertPosting.insertId;

                      callback(null, postingId, userId, categoryId);
                    }
                  });
                }

                function insertUpload(postingId, userId, categoryId, callback){
                  var sql = 'INSERT INTO upload (posting_id, user_id, category_id) VALUE (?, ?, ?)';
                  var sqlParams = [Number(postingId), Number(userId), Number(categoryId)];

                  conn.query(sql, sqlParams, function (error, results, fields) {
                    if(error){
                      console.log("insertUpload error");
                      console.log(error);
                      resultObject.insert = false;

                      var errorTitle = errorPrefix + "insertUpload error";

                      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
                        callback(true, resultObject);
                      });
                    }else{
                      console.log("insertUpload");

                      callback(null, resultObject);
                    }

                  });
                }
              }else{
                callback(true, null);
              }


            }
          });

        });

      });



  });

};


function deleteS3Image(objects, callback){
  console.log("removeS3Images");

  var params = {
    Delete:{
      Objects: objects
    }
  };

  s3Bucket.deleteObjects(params, function(error, data){
    if(error){
      console.log("deleteObjects error");
      console.log(error.stack);
      var errorTitle = errorPrefix + "deleteObjects error";

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      callback(null, data);
    }
  });
}

exports.removeS3Images = function(objects, callback){
  console.log("removeS3Images");
  deleteS3Image(objects, function(error, result) {
    callback(error, result)
  });
};
