fs = require('fs');

var allSensors = fs.readdirSync('/sys/bus/w1/devices');

for(var i = 0; i < allSensors.length; i++){
        if(allSensors[i] != 'w1_bus_master1'){
                var logPath = '/sys/bus/w1/devices/' + allSensors[i] + '/w1_slave';
                var tempFile = fs.readFileSync(logPath,'utf8');
                var splitTemp = tempFile.split('t=');
                console.log('Temp is', splitTemp[1]);
        }
}

