var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

const qs = require('querystring');

var userModel = require('../../../../models/api/user.model');
var repositoryModel = require('../../../../models/api/repository.model');
var postingModel = require('../../../../models/api/posting.model');

/*
	POST

	Upload posting.
*/
router.post('/', function(req, res, next) {
	console.log("Upload posting");

	repositoryModel.uploadImage(req, function(error, uploadObject){
		var resultObject = uploadObject;

		res.json(resultObject);
	});

});

/*
	GET

	Load all posting.
*/
router.get(['/list/:idx?/:postingNum?'], function(req, res, next) {
	console.log("Load posting");

	const startIdx = req.params.idx || 0;
	const postingNum = req.params.postingNum || 12;

  var resultObject = new Object({});

	//console.log(startIdx, postingNum);

	postingModel.loadAllPosting(startIdx, postingNum, function(error, postingObject){
		if(error){
      console.log(error);
      resultObject.error = true;

      res.json(resultObject);
		}else{
			//console.log(startIdx, postingNum);
      resultObject.error = false;

      resultObject.posting = postingObject;

      res.json(postingObject);
		}
	});
});


module.exports = router;
