
var config = require('config.json')('./config/config.json');

var mongoose = require('mongoose');

// Release
//var uri = config.docker.mongodb;

// Debug
var uri = 'mongodb://localhost:27017/auc';

mongoose.connect(uri);

var ingredient = require('../../schema/ingredient');


exports.loadIngredient = function (callback){
  var resultObject = new Object({});

  ingredient.find(function(error, ingredients){
    if(error){
      resultObject.error = true;
    }else{
      resultObject = ingredients;
    }

    callback(error, resultObject);
  });
};
