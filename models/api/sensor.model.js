
var config = require('config.json')('./config/config.json');

var errorModel = require('./error.model');
var errorPrefix = "deviceModel/";

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase
});

conn.connect();



exports.addSensor = function(name, description, serialNumber, callback){
  console.log("addSensor");

  var resultObject = new Object({});

  var sql = "INSERT INTO sensor (name_sn, description_ln, serial_number_mn) VALUE (?, ?, ?)";

  var sqlParams = [name, description, serialNumber];

  conn.query(sql, sqlParams, function(error, resultInsert){
    if(error){
      var logSummary = "insertSensor error";
      console.log(logSummary);
      console.log(error);

      resultObject.insert = false;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.insert = true;

      callback(null, resultObject);
    }
  });
};


exports.loadAllSensor =  function(callback){
  console.log("loadAllSensor");

  var resultObject = new Object({});

  var sql = "SELECT * FROM sensor";

  conn.query(sql, function(error, resultLoad){
    if(error){
      var logSummary = "loadAllSensor error";
      console.log(logSummary);
      console.log(error);

      resultObject.load = false;
      resultObject.sensor = null;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.load = true;
      resultObject.sensor = resultLoad;

      callback(null, resultObject);
    }
  });
};

exports.updateSensor = function(sensorId, name, description, serialNumber, callback){
  console.log("updateSensor");

  var resultObject = new Object({});

  var sql = "UPDATE sensor SET name_sn = ?, description_ln = ?, serial_number_mn = ? WHERE sensor_id  = ?";

  var sqlParams = [name, description, serialNumber, sensorId];

  conn.query(sql, sqlParams, function(error, resultUpdate){
    if(error){
      var logSummary = "updateSensor error";
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

exports.removeSensor = function(sensorId, callback){
  console.log("removeSensor");

  var resultObject = new Object({});

  var sql = "DELETE FROM sensor WHERE sensor_id  = ?";

  var sqlParams = [sensorId];

  conn.query(sql, sqlParams, function(error, resultRemove){
    if(error){
      var logSummary = "removeSensor error";
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
