
var config = require('config.json')('./config/config.json');

exports.decodeAudioFile = function(callback){
  var resultObject = new Object({});
  var speech = require('@google-cloud/speech');

  var client = speech({
     projectId: config.gcloud.projectId,
     keyFilename: './config/auc-iot-e8e23e695d1c.json'
  });

  var languageCode = 'en-US';
  //var sampleRateHertz = 16000;
  //var encoding = 'LINEAR16';
  var sampleRateHertz = 44100;
  var encoding = speech.v1.types.RecognitionConfig.AudioEncoding.FLAC;

  var audioConfig = {
      languageCode : languageCode,
      sampleRateHertz : sampleRateHertz,
      encoding : encoding
  };

  //var uri = 'file:///Users/mac/Desktop/Github/nodejs-docs-samples/speech/resources/audio.raw';
  var uri = "gs://gapic-toolkit/hello.flac";

  var audio = {
      //content : uri
      uri: uri
  };

  var request = {
      config: audioConfig,
      audio: audio
  };

  client.recognize(request)
  .then(function(data) {
      var response = data[0];
      console.log(response);
      const transcription = response.results.map(result =>
          result.alternatives[0].transcript).join('\n');
      console.log(`Transcription: `, transcription);

      resultObject.data = transcription;
      resultObject.decode = true;

      callback(null, resultObject);
  })
  .catch(function(err) {
      console.error(err);
      resultObject.decode = false;

      callback(true, resultObject);
  });
};
