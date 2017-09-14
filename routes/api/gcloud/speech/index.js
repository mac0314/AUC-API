var express = require('express');
var router = express.Router();

var gcloudAPI = require('../../../../controllers/api/gcloud.controller');

/*
	GET

	gcloud speech API
*/
router.get('/audio', function(req, res, next) {
  gcloudAPI.decodeAudioFile(function(error, resultObject){
    res.json(resultObject);
  });
});

module.exports = router;
