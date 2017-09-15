
var config = require('config.json')('./config/config.json');

var modelLog = "Device";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

/*
  Device table
*/
exports.addDevice = function(name, description, serialNumber, callback){
  var sql = "INSERT INTO device (name_sn, description_ln, serial_number_mn) VALUE (?, ?, ?)";

  var sqlParams = [name, description, serialNumber];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.loadAllDevice =  function(callback){
  var sql = "SELECT * FROM device";

  var sqlParams = [];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateDevice = function(deviceId, name, description, serialNumber, callback){
  var sql = "UPDATE device SET name_sn = ?, description_ln = ?, serial_number_mn = ? WHERE device_id = ?";

  var sqlParams = [name, description, serialNumber, deviceId];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.removeDevice = function(deviceId, callback){
  var sql = "DELETE FROM device WHERE device_id  = ?";

  var sqlParams = [deviceId];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

/*
  Include table
*/
exports.addInclude = function(deviceId, sensorId, callback){
  var sql = "INSERT INTO include (device_id, sensor_id) VALUE (?, ?)";

  var sqlParams = [deviceId, sensorId];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.loadInclude =  function(callback){
  var sql = "SELECT * FROM include";

  var sqlParams = [];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateInclude = function(includeId, postDeviceId, postSensorId, callback){
  var sql = "UPDATE include SET device_id = ?, sensor_id = ? WHERE include_id = ?";

  var sqlParams = [postDeviceId, postSensorId, includeId];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.removeInclude = function(includeId, callback){
  var sql = "DELETE FROM include WHERE include_id  = ?";

  var sqlParams = [includeId];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
