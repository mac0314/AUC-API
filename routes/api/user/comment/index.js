var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var postingModel = require('../../../../models/api/posting.model');
var commentModel = require('../../../../models/api/comment.model');
var userModel = require('../../../../models/api/user.model');


/*
	POST

	Add comment.
*/
router.post('/:postingId/comment', function(req, res, next) {
	var postingId = req.params.postingId;
	var email = req.decoded.data.email;
	var content = req.body.content;

	var resultObject = new Object({});

	if(content.trim() === ""){
		resultObject.error = true;
    resultObject.comment = null;

		res.json(resultObject);
	}else{
		userModel.loadUserEmailById(email, function(error, resultLoad){
			var userId = resultLoad.id;

			commentModel.addComment(postingId, userId, content, function(error, commentObject){
				if(error){
          resultObject.error = true;
          resultObject.add = false;
					console.log("error");


					res.json(resultObject);
				}else{
          resultObject.error = false;
          resultObject.add = true;
          resultObject.comment = commentObject;


					res.json(resultObject);
				}

			});
		});
	}

});


/*
	POST

	Remove comment.
*/
router.post('/delete/:commentId', function(req, res, next) {
	var commentId = req.params.commentId;

	commentModel.removeComment(commentId, function(error, resultRemove){
		if(error){
			console.log("error");
			res.json(resultRemove);
		}else{
			res.json(resultRemove);
		}
	});
});



module.exports = router;
