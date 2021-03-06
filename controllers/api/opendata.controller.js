
var request = require('request');

// data.go.kr
exports.getNutrient = function(ingredient, callback){
  var resultObject = new Object({});
  var url = 'http://apis.data.go.kr/1470000/FoodRwmatrInfoService/getFoodRwmatrList';
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=PWvP%2BzsCCxzdJCKNAM9MiJFa823x7t%2BAQxxH76n7zWit7Tje3vW%2B%2BzcnN%2BC1P28JMi%2BgLuSqrS%2Bd2BYbEdVO4w%3D%3D'; /* Service Key*/
  queryParams += '&' + encodeURIComponent('rprsnt_rawmrl_nm') + '=' +
  //ingredient;
  encodeURIComponent(ingredient); /* 원재료명 */
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 페이지번호 */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('3'); /* 한 페이지 결과 수 */

  request({
      url: url + queryParams,
      method: 'GET'
  }, function (error, response, body) {
      resultObject.data = body;
      callback(null, resultObject);
  });
}
