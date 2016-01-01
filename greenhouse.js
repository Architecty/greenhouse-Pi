var fs = require('fs'),
    DDP = require('ddp'),
    moment = require('moment'),
    ddpLogin = require('ddp-login'),
    config = require('./config.js');

var ddp = new DDP({
  host: config.ddpHost,
  port: config.ddpPort,
  use_ejson: true
})


ddp.connect(function(err){
  if(err) throw err;
  ddpLogin(ddp, {
    env: "METEOR_TOKEN",
    method: "account",
    account: config.ddpEmail,
    pass: config.ddpPassword,
    retry: 5,
    plaintext: false
  }, function(err, userInfo){
    if(err) throw err;

    var allSensors = fs.readdirSync('/sys/bus/w1/devices');
    var sensorValues = [];

    for(var i = 0; i < allSensors.length; i++){
      if(allSensors[i] != 'w1_bus_master1'){
        var logPath = '/sys/bus/w1/devices/' + allSensors[i] + '/w1_slave';
        var tempFile = fs.readFileSync(logPath,'utf8');
        var splitTemp = tempFile.split('t=');
        if(splitTemp.length > 1){
          var currentTemp = splitTemp[1];
          sensorValues.push({sensorID: allSensors[i], value: currentTemp});
        }
        console.log('Temp is', splitTemp[1]);
      }
    }
    ddp.call(
      'addValues',             // name of Meteor Method being called
      [sensorValues],            // parameters to send to Meteor Method
      function (err, result) {   // callback which returns the method call results
      },
      function () {              // callback which fires when server has finished
        ddp.close();
      }
    )
  })
})


