var express = require('express');
var router = express.Router();

var config = require('config.json')('./config/config.json');

var userModel = require('../../../../models/api/user.model');

var nodemailer = require('nodemailer');


var smtpTransport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
				user: config.mailer.user,
				pass: config.mailer.password
		}
});
router.post('/password', function(req, res, next) {
	var email = req.body.email;

	var resultObject = new Object({});

	userModel.findPassword(email, function(error, findObject){
		console.log(findObject);
		if(error){
			console.log('Error : ', error);
			resultObject.find = false;
			resultObject.error = true;

			res.json(resultObject);
		}else{
			resultObject.email = findObject;

			var mailOptions = {
					from: '김영민 <rladudals02@ajou.ac.kr>',
					to: email,
					subject: '피펫 아이디의 비밀번호가 변경되었습니다',
					text: JSON.stringify(findObject)
			};

			smtpTransport.sendMail(mailOptions, function(error, response){
				if (error){
						console.log(error);
				} else {

					console.log("Message sent : " + JSON.stringify(findObject));
				}
				smtpTransport.close();

				res.json(resultObject);
	 		});

		}
	});

});

module.exports = router;
