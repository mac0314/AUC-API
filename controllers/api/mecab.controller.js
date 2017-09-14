
var request = require('request');

// elasticsearch - mecab plugin
exports.decodeData = function(command, callback){
  var resultObject = new Object({});

  var url = "http://localhost:9200/seunjeon-idx/_analyze?analyzer=korean&pretty";

  console.log(command);

  request({
    url: url,
    method: 'POST',
    body: command
  }, function (error, response, html) {
    var parsingObject = new Object({});

    parsingObject = JSON.parse(response.body);
    var tokensObject = parsingObject.tokens;
    console.log(tokensObject);

    decodeTokens(tokensObject, function(error, objectDecoded){
      var typeObject = objectDecoded;
      if(typeObject.sCheck || typeObject.dCheck){
        resultObject.recommand = true;
        resultObject.typeObject = typeObject;

      }else{
        resultObject.recommand = false;
      }

      callback(null, resultObject)
    });


  });
};


function decodeTokens(typeObject, callback){
  var typeNObejct = {
    smoody: false,
    dish: false,
    sCheck: false,
    dCheck: false
  };
  var lastIdx = -1; // smoody = 0, dish = 1, both = 2

  for(var i = 0; i < typeObject.length; i++){
    var word = typeObject[i].token;

    if(word.match("주스/N")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
      if(lastIdx === 1){
        lastIdx = 2;
      }else{
        lastIdx = 0;
      }
    }else if(word.match("음료/N")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
      if(lastIdx === 1){
        lastIdx = 2;
      }else{
        lastIdx = 0;
      }
    }else if(word.match("생수/N")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
      if(lastIdx === 1){
        lastIdx = 2;
      }else{
        lastIdx = 0;
      }
    }else if(word.match("스무디/N")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
      if(lastIdx === 1){
        lastIdx = 2;
      }else{
        lastIdx = 0;
      }
    }else if(word.match("음식/N")){
      typeNObejct.dish = true;
      typeNObejct.dCheck = true;
      if(lastIdx === 0){
        lastIdx = 2;
      }else{
        lastIdx = 1;
      }
    }else if(word.match("요리/N")){
      typeNObejct.dish = true;
      typeNObejct.dCheck = true;
      if(lastIdx === 0){
        lastIdx = 2;
      }else{
        lastIdx = 1;
      }
    }else if(word.match("추천/N")){
      if(lastIdx === 1){
        typeNObejct.dish = true;
        typeNObejct.dCheck = true;
      }else if(lastIdx === 2){
        typeNObejct.smoody = true;
        typeNObejct.sCheck = true;
        typeNObejct.dish = true;
        typeNObejct.dCheck = true;
      }else{
        typeNObejct.smoody = true;
        typeNObejct.sCheck = true;
      }
    }else if(word.match("마르/V")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
    }else if(word.match("목마르/V")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
    }else if(word.match("마시/V")){
      typeNObejct.smoody = true;
      typeNObejct.sCheck = true;
    }else if(word.match("먹/V")){
      typeNObejct.dish = true;
      typeNObejct.dCheck = true;
    }else if(word.match("알리/V")){
      if(lastIdx === 1){
        typeNObejct.dish = true;
        typeNObejct.dCheck = true;
      }else if(lastIdx === 2){
        typeNObejct.smoody = true;
        typeNObejct.sCheck = true;
        typeNObejct.dish = true;
        typeNObejct.dCheck = true;
      }else{
        typeNObejct.smoody = true;
        typeNObejct.sCheck = true;
      }
    }else if(word.match("가르치/V")){
      if(lastIdx === 1){
        typeNObejct.dish = true;
        typeNObejct.dCheck = true;
      }else if(lastIdx === 2){
        typeNObejct.smoody = true;
        typeNObejct.sCheck = true;
        typeNObejct.dish = true;
        typeNObejct.dCheck = true;
      }else{
        typeNObejct.smoody = true;
        typeNObejct.sCheck = true;
      }
    }else if(word.match("않/M")){
      if(lastIdx === 1){
        typeNObejct.dish = false;
        typeNObejct.dCheck = false;
      }else if(lastIdx === 2){
        typeNObejct.smoody = false;
        typeNObejct.sCheck = false;
        typeNObejct.dish = false;
        typeNObejct.dCheck = false;
      }else{
        typeNObejct.smoody = false;
        typeNObejct.sCheck = false;
      }
      lastIdx = -1;
    }else if(word.match("안/M")){
      if(lastIdx === 1){
        typeNObejct.dish = false;
        typeNObejct.dCheck = false;
      }else if(lastIdx === 2){
        typeNObejct.smoody = false;
        typeNObejct.sCheck = false;
        typeNObejct.dish = false;
        typeNObejct.dCheck = false;
      }else{
        typeNObejct.smoody = false;
        typeNObejct.sCheck = false;
      }
      lastIdx = -1;
    }else if(word.match("지마/V")){
      if(lastIdx === 1){
        typeNObejct.dish = false;
        typeNObejct.dCheck = false;
      }else if(lastIdx === 2){
        typeNObejct.smoody = false;
        typeNObejct.sCheck = false;
        typeNObejct.dish = false;
        typeNObejct.dCheck = false;
      }else{
        typeNObejct.smoody = false;
        typeNObejct.sCheck = false;
      }
      lastIdx = -1;
    }

  }

  callback(null, typeNObejct);
}
