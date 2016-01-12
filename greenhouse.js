var fs = require('fs'),
    DDP = require('ddp'),
    moment = require('moment'),
    ddpLogin = require('ddp-login'),
    config = require('./config.js'),
    os = require('os');

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

    //Since our IP address may shift, check with each push and let the server know. Slightly simpler than setting this up to email changes.
    var ifaces = os.networkInterfaces();
    var currentIP = "";
    for (var dev in ifaces) {

      // ... and find the one that matches the criteria
      var iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false;
      });

      if(iface.length > 0) currentIP = iface[0].address;
    }

    var allSensors = fs.readdirSync('/sys/bus/w1/devices');
    var sensorValues = [];

    for(var i = 0; i < allSensors.length; i++){
      if(allSensors[i] != 'w1_bus_master1'){
        var logPath = '/sys/bus/w1/devices/' + allSensors[i] + '/w1_slave';
        var tempFile = fs.readFileSync(logPath,'utf8');
        var splitTemp = tempFile.split('t=');
        if(splitTemp.length > 1){
          var currentTemp = splitTemp[1];
          sensorValues.push({
            sensorID: allSensors[i],
            value: currentTemp,
            currentIP: currentIP,
            sensorType:"temp"
          });
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


