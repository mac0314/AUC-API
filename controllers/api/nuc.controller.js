
var recipeModel = require('../../models/api/recipe.model');

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url');
var base = "https://www.nuc.co.kr";

// NUC 전자
// www.nuc.co.kr
exports.requestDataAndSave = function (recipeId, type, callback){
  console.log("requestDataAndSave");

  this.requestData(recipeId, type, function (error, recipeObject) {
    console.log(recipeObject);
    recipeModel.addRecipe(recipeObject.name, recipeObject.summary, recipeObject.content, recipeObject.imagePath, Number(recipeObject.recipeId), recipeObject.type, Number(recipeObject.likesNum), function(error, objectSaved){
      callback(error, objectSaved);
    });
  });
};

exports.requestData = function requestData(recipeId, type, callback){
  console.log("requestData");
  var url = "https://www.nuc.co.kr/community/bbs/board.php?bo_table=recipe&wr_id=" + recipeId + "&sca=" + type;

  var resultObject = new Object({});

  request(url, function (error, response, html) {
      var $ = cheerio.load(html);

      $('td.text_body').each(function(){
        var imagePath = "";
        var relativeLinks = $("img");
        relativeLinks.each( function() {
          var link = $(this).attr('src');
          var fullImagePath = URL.resolve(base, link); // should be absolute
          imagePath = fullImagePath;
          console.log(link);
          if (link.startsWith('http')){
              console.log('abs');
          }
          else {
              console.log('rel');
          }
        });
        console.log(imagePath);

        var text = $(this).text().replace(/\t/g, "").replace(/\n/g, "").replace(/\s+$/g, "");

        var textArray = text.split("엔유씨몰 바로가기▼");

        var name = textArray[0].split('[')[1].split(']')[0];
        var summary = textArray[0].split('[')[0];
        var content = textArray[0];
        text = textArray[1];
        textArray = text.split("좋아요 ");
        var likesNum = textArray[1];

        resultObject.name = name;
        resultObject.summary = summary;
        resultObject.content = content;
        resultObject.likesNum = likesNum;
        resultObject.imagePath = imagePath;
        resultObject.recipeId = recipeId;
        resultObject.type = type;

        console.log(resultObject);

        callback(null, resultObject);

    });
  });
};
