
var express = require('express');
var router = express.Router();

var request = require('request');

var mecabAPI = require('../../../controllers/api/mecab.controller');


/*
	POST

	Read text and reponse.
*/
router.post('/', function(req, res, next) {
  var text = req.body.text;

  mecabAPI.decodeData(text, function(error, resultObject){
    res.json(resultObject);
  });
});


module.exports = router;
