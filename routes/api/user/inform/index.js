var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var userInformModel = require('../../../../models/api/user_inform.model');



const sixHourMilliSec = 6 * 60 * 60 * 1000;
const monthMilliSec = 30 * 24 * 60 * 60 * 1000;

/*
	GET

	Read user information.
*/
router.get('/:email?', function(req, res, next) {
  console.log('get user information');

  var email = req.params.email || "";

  if(email === ""){
    userInformModel.loadAllUserInform(function(error, userObject){
      res.json(userObject);
    });
  }else{
    userInformModel.loadUserInform(email, function(error, userObject){
      res.json(userObject);
    });
  }
});

/*
	PUT

	Update user.
*/
router.put('/', function(req, res, next) {
  var email = req.body.email;

  console.log("Update user information");

});



module.exports = router;
