var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var recipeModel = require('../../../models/api/recipe.model');


var request = require('request');
var cheerio = require('cheerio')


/*
	POST

	NUC page recipe
*/
router.post('/:recipeId/:type', function(req, res, next) {
  var recipeId = req.params.recipeId;
  var type = req.params.type;

  var url = "https://www.nuc.co.kr/community/bbs/board.php?bo_table=recipe&wr_id=" + recipeId + "&sca=" + type;

  var resultObject = new Object({});

  request(url, function (error, response, html) {
    /*
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    */
    //console.log(body);
    //console.log(response);

    var $ = cheerio.load(html);

    $('td.text_body').each(function(){
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

        recipeModel.addRecipe(name, content, likesNum, function(error, recipeObject){
          res.json(recipeObject);
        });

    })
  });
});

/*
  GET

  Recipe data
*/
router.get('/', function(req, res, next) {
  recipeModel.loadAllRecipe(function(error, recipeObject){
    res.json(recipeObject);
  });
});

/*
	POST

	NUC page recipe
*/
router.get('/nuc/:recipeId/:type', function(req, res, next) {
  var recipeId = req.params.recipeId;
  var type = req.params.type;

  var url = "https://www.nuc.co.kr/community/bbs/board.php?bo_table=recipe&wr_id=" + recipeId + "&sca=" + type;

  var resultObject = new Object({});

  request(url, function (error, response, html) {
    /*
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    */
    //console.log(body);
    //console.log(response);

    var $ = cheerio.load(html);

    $('td.text_body').each(function(){
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
      resultObject.likesNum = Number(likesNum);

      res.json(resultObject);
    });
  });
});

module.exports = router;
