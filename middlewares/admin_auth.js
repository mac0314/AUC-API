const jwt = require('jsonwebtoken');

var errorModel = require('../models/api/error.model');

var errorPrefix = "admin_auth/"

const authMiddleware = (req, res, next) => {
    // read the token from header or url
    const userData = req.decoded.data;
    const userRole = userData.role;

    console.log("admin_auth");
    //console.log(userData);


    const p = new Promise(
        (resolve, reject) => {
            if(userRole === "admin"){
              console.log("resolve");
              resolve();
            }else{
              const error = true;
              console.log("reject");
              reject(error);
            }
        }
    );

    // if role is user
    const onError = (error) => {
      var errorTitle = errorPrefix;

      errorModel.reportErrorLog(null, errorTitle, error, function(error, result){
        var resultObject = new Object({});
        resultObject.signin = false;

        res.json(resultObject);
      });
    };

    // process the promise
    p.then(()=>{
        next();
    }).catch(onError);
};

module.exports = authMiddleware;
