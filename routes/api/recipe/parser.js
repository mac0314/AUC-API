var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');


var request = require('request');
var cheerio = require('cheerio')

/*
	GET

	NUC page recipe
*/
router.get('/:recipeId/:type', function(req, res, next) {
  var recipeId = req.params.recipeId;
  var type = req.params.type;

  var url = "https://www.nuc.co.kr/community/bbs/board.php?bo_table=recipe&wr_id=" + recipeId + "&sca=" + type;

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
        //console.log("레시피 : " + $(this).text());

        res.send($(this).text());
    })
  });
});


module.exports = router;
