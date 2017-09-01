
var config = require('config.json')('./config/config.json');

var errorModel = require('./error.model');
var errorPrefix = "deviceModel/";

var sensorModel = require('./sensor.model');
var userModel = require('./user.model');

var dateFormat = require('dateformat');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.aucdatabase
});

conn.connect();

/*
  Device table
*/
exports.addDevice = function(name, description, serialNumber, callback){
  console.log("addDevice");

  var resultObject = new Object({});

  var sql = "INSERT INTO device (name_sn, description_ln, serial_number_mn) VALUE (?, ?, ?)";

  var sqlParams = [name, description, serialNumber];

  conn.query(sql, sqlParams, function(error, resultInsert){
    if(error){
      var logSummary = "insertDevice error";
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

exports.loadAllDevice =  function(callback){
  console.log("loadAllDevice");

  var resultObject = new Object({});

  var sql = "SELECT * FROM device";

  conn.query(sql, function(error, resultLoad){
    if(error){
      var logSummary = "loadAllDevice error";
      console.log(logSummary);
      console.log(error);

      resultObject.load = false;
      resultObject.device = null;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.load = true;
      resultObject.device = resultLoad;

      callback(null, resultObject);
    }
  });
};

exports.updateDevice = function(deviceId, name, description, serialNumber, callback){
  console.log("updateDevice");
};

exports.removeDevice = function(deviceId, callback){
  console.log("removeDevice");

  var resultObject = new Object({});

  var sql = "DELETE FROM device WHERE device_id  = ?";

  var sqlParams = [deviceId];

  conn.query(sql, sqlParams, function(error, resultRemove){
    if(error){
      var logSummary = "removeDevice error";
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

/*
  Include table
*/
exports.addInclude = function(deviceId, sensorId, callback){
  console.log("addInclude");

  var resultObject = new Object({});

  var sql = "INSERT INTO include (device_id, sensor_id) VALUE (?, ?)";

  var sqlParams = [deviceId, sensorId];

  conn.query(sql, sqlParams, function(error, resultInsert){
    if(error){
      var logSummary = "insertSensor error"
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

exports.loadInclude =  function(callback){
  console.log("loadInclude");

  var resultObject = new Object({});

  var sql = "SELECT * FROM include";

  conn.query(sql, function(error, resultLoad){
    if(error){
      var logSummary = "loadInclude error";
      console.log(logSummary);
      console.log(error);

      resultObject.load = false;
      resultObject.include = null;

      var errorTitle = errorPrefix + logSummary;

      errorModel.reportErrorLog(null, errorTitle, error.stack, function(error, result){
        callback(true, resultObject);
      });
    }else{
      resultObject.load = true;
      resultObject.include = resultLoad;

      callback(null, resultObject);
    }
  });
};

exports.updateInclude = function(includeId, postDeviceId, postSensorId, callback){
  console.log("updateInclude");

  var resultObject = new Object({});

  var sql = "UPDATE include SET device_id = ?, sensor_id = ? WHERE include_id = ?";

  var sqlParams = [postDeviceId, postSensorId, includeId];

  conn.query(sql, sqlParams, function(error, resultUpdate){
    if(error){
      var logSummary = "updateInclude error";
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

exports.removeInclude = function(includeId, callback){
  console.log("removeInclude");

  var resultObject = new Object({});

  var sql = "DELETE FROM include WHERE include_id  = ?";

  var sqlParams = [includeId];

  conn.query(sql, sqlParams, function(error, resultRemove){
    if(error){
      var logSummary = "removeInclude error";
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
