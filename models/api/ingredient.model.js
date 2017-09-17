
var config = require('config.json')('./config/config.json');

var mongoose = require('mongoose');

var uri = config.docker.mongodb;

mongoose.connect(uri);

var Ingredient = require('../../schema/ingredient');


exports.addIngredient = function (name, degree, nutrients, callback){
  var resultObject = new Object({});
  var ingredient = new Ingredient();

  ingredient.name = name;
  ingredient.degree = degree;
  ingredient.nutrients = nutrients;

  resultObject = ingredient;

  //console.log(ingredient);

  Ingredient.findOne({name:name}, function(error, findObject){
    if(error){
      resultObject.find = false;

      callback(true, resultObject);
    }else{
      if(findObject === null){
        // No data
        resultObject.find = false;
        ingredient.save(function(error){
          if(error){
            console.log(error);
            resultObject.insert = false;

            callback(true, resultObject);
          }else{
            resultObject.insert = true;

            callback(null, resultObject);
          }
        });
      }else{
        // Already have data
        resultObject.find = true;
        resultObject.insert = false;

        callback(null, resultObject);
      }
    }
  });
};


exports.loadIngredient = function (callback){
  var resultObject = new Object({});

  Ingredient.find(function(error, findObject){
    if(error){
      resultObject.find = false;
    }else{
      resultObject = findObject;
      resultObject.find = true;
    }

    callback(error, resultObject);
  });
};


exports.updateIngredient = function (name, degree, nutrients, callback){
  var ingredient = new Ingredient();

  var doc = {
    degree: degree,
    nutrients: nutrients
  };

  Ingredient.update({name: name}, doc, function(error, result){
    console.log(result);

    callback(error, result);
  });
};


exports.removeIngredient = function (name, callback){
  var resultObject = new Object({});

  Ingredient.findOneAndRemove({name: name}, function(error, removeObject){
    console.log(removeObject);
    if(error){
      resultObject.remove = false;
    }else{
      resultObject.remove = true;
    }
    callback(error, resultObject);
  });
};
