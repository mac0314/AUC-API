
var modelLog = "Sensor";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addSensor = function(name, description, serialNumber, callback){
  var sql = "INSERT INTO sensor (name_sn, description_ln, serial_number_mn) VALUE (?, ?, ?)";

  var sqlParams = [name, description, serialNumber];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};


exports.loadSensor = function(serialNumber, callback){
  var sql = "SELECT sensor_id AS sensorId, name_sn AS name, description_ln AS description, serial_number_mn AS serialNumber FROM sensor";

  var sqlParams = [];

  if(serialNumber !== null){
    sql += " WHERE serial_number_mn = ?";

    sqlParams.push(serialNumber);
  }

  queryModel.request("select", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateSensor = function(sensorId, name, description, serialNumber, callback){
  var sql = "UPDATE sensor SET name_sn = ?, description_ln = ?, serial_number_mn = ? WHERE sensor_id  = ?";

  var sqlParams = [name, description, serialNumber, sensorId];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.removeSensor = function(sensorId, callback){
  var sql = "DELETE FROM sensor WHERE sensor_id  = ?";

  var sqlParams = [sensorId];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
