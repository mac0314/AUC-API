const jwt = require('jsonwebtoken')

const config = require('config.json')('./config/config.json');

const secretKey = config.jwt.secretKey;

// TEST data
//const sixHourMilliSec = 12 * 1000;
//const monthMilliSec = 20 * 1000;
const sixHourMilliSec = 6 * 60 * 60 * 1000;
const monthMilliSec = 30 * 24 * 60 * 60 * 1000;
const sixHourSec =  sixHourMilliSec / 1000;
const monthSec =  monthMilliSec / 1000;


var userModel = require('../models/api/user.model');

var dateFormat = require('dateformat');

var now = new Date();
var today = dateFormat(now, "isoDate");

const authMiddleware = (req, res, next) => {
    // read the token from header or url
    const accessToken = req.headers['access_token'] || req.query.access_token || req.cookies.access_token;
    const refreshToken = req.headers['refresh_token'] || req.query.refresh_token || req.cookies.refresh_token;

    console.log("access_token : ", accessToken);
    //console.log("refresh_token : ", refreshToken);

    // create a promise that decodes the accessToken
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(accessToken, secretKey, (error, accessTokenDecoded) => {
                if(error){
                  console.log("1. accessToken verify error");

                  jwt.verify(refreshToken, secretKey, (error, refreshTokenDecoded) => {
                    if(error){
                      console.log("2. refreshToken verify error");

                      reject(error);
                    }else{
                      //console.log("refreshTokenDecoded : ", refreshTokenDecoded);
                      //console.log(refreshTokenDecoded.data);
                      const email = refreshTokenDecoded.data.email;

                      userModel.changeUserToken(email, "access_token", refreshTokenDecoded.data, function(error, result){
                        if(error){
                          console.log("change accessToken error");
                          resolve(refreshTokenDecoded);
                        }else{
                          console.log("change accessToken");

                          res.cookie('access_token', result, {expires: new Date(Date.now() + sixHourMilliSec), httpOnly: true});

                          userModel.changeUserToken(email, "refresh_token", refreshTokenDecoded.data, function(error, result){
                            if(error){
                              console.log("change refreshToken error");
                              resolve(refreshTokenDecoded);
                            }else{
                              console.log("change refreshToken");

                              res.cookie('refresh_token', result, {expires: new Date(Date.now() + monthMilliSec), httpOnly: true})
                              jwt.verify(result, secretKey, (error, resultDecoded) => {
                                if(error){
                                  console.log("error");
                                  reject(error);
                                }else{
                                  console.log("ok");
                                  resolve(resultDecoded);
                                }
                              });

                            }
                          });

                        }
                      });
                    }

                  });

                }else{
                  console.log("accessToken verify");
                  //console.log("accessTokenDecoded : ", accessTokenDecoded);
                  const email = accessTokenDecoded.data.email;

                  /*
                  const exp = accessTokenDecoded.exp;
                  //const iat = accessTokenDecoded.iat;

                  */

                  userModel.changeUserToken(email, "access_token", accessTokenDecoded.data, function(error, result){
                    if(error){
                      console.log("update access_token error");

                      resolve(accessTokenDecoded);
                    }else{
                      console.log("update access_token");
                      //console.log("accessTokenDecoded.data : ", accessTokenDecoded.data);

                      res.cookie('access_token', result, {expires: new Date(Date.now() + sixHourMilliSec), httpOnly: true})
                    }
                  });


                  jwt.verify(refreshToken, secretKey, (error, refreshTokenDecoded) => {
                    if(error){
                      console.log("refreshToken verify error");
                      userModel.changeUserToken(email, "refresh_token", accessTokenDecoded.data, function(error, result){
                        if(error){
                          console.log("changeToken error");

                          resolve(accessTokenDecoded);
                        }else{
                          console.log("change token");
                          //console.log("refresh_token : ", refreshTokenDecoded);

                          res.cookie('refresh_token', result, {expires: new Date(Date.now() + monthMilliSec), httpOnly: true})
                          resolve(accessTokenDecoded);
                        }
                      });
                    }else{
                      /*
                      //console.log(refreshTokenDecoded);
                      var now = Math.floor(new Date().getTime() / 1000);
                      const exp = refreshTokenDecoded.exp;
                      //const iat = refreshTokenDecoded.iat;

                      console.log(exp, now);

                      var timeRemained = (exp - now) % 1000000; // sec

                      console.log(timeRemained, sixHourSec);

                      //
                      var hour = Math.floor(timeRemained / (60 * 60));
                      var min = Math.floor((timeRemained - (hour * 60 * 60)) / 60);
                      var sec = timeRemained - (hour * 60 * 60) - (min * 60);

                      console.log("timeRemained : ", timeRemained);
                      console.log("hour", hour, ", min", min, ", sec", sec);
                      */

                      userModel.changeUserToken(email, "refresh_token", accessTokenDecoded.data, function(error, result){
                        if(error){
                          console.log("changeToken error");

                          resolve(accessTokenDecoded);
                        }else{
                          console.log("change token");
                          //console.log("accessTokenDecoded.data : ", accessTokenDecoded.data);

                          res.cookie('refresh_token', result, {expires: new Date(Date.now() + monthMilliSec), httpOnly: true})
                          resolve(accessTokenDecoded);
                        }
                      });
                    }



                  });
                }
            });
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.render('user/signin', {title: global.title});
    }

    // process the promise
    p.then((tokenDecoded)=>{
      req.decoded = tokenDecoded;

      var email = req.decoded.data.email;
      console.log("email : ", email);
      //var dataObject = JSON.parse(req.decoded.data);
      //console.log("dataObject : ", dataObject);
      //console.log("req.decoded.data : ", req.decoded.data);
      //console.log("dataObject.email", dataObject.email);
      if(email === undefined){
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
      }else{
        console.log("tokenDecoded ok");

        userModel.signinToday(email, function(error, result){
          next();
        });

      }

    }).catch(onError);
};

module.exports = authMiddleware;
