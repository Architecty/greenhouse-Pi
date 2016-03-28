# greenhouse-Pi
The raspberry-pi component of this greenhouse monitor

## Wiring the Raspberry Pi

Use the instructions found [here](https://www.cl.cam.ac.uk/projects/raspberrypi/tutorials/temperature/) to set up your temperature thermometer. Once you've determined that it's reading the temperature as it should, continue. 

## Setting up the code on the Raspberry Pi

There are a few steps you need to make to get your raspberry pi to send data to the target server. 

1. Setup [Greenhouse-Meteor](https://github.com/Architecty/greenhouse-meteor), and create a new controller.
2. Clone this repository onto your raspberry pi. 
3. Install [Node](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server) and [forever](https://www.npmjs.com/package/forever). 
4. Run `npm install` from the repository directory to install the needed packages from package.json. 
5. Setup Cron to automatically restart forever, by typing `crontab -e`, and adding the following line: `@reboot /usr/local/bin/forever start -c /usr/local/bin/node --uid "greenhouse" -a /path/to/repository/greenhouse.js
6. (Optional) Setup Cron to automatically pull and apply updates from this repository each day, by typing `crontab-e`, and adding the following line `01 01 * * * "cd /path/to/repository && git pull && forever restart greenhouse"`.
7. Download the config file from the greenouse-meteor app controller setup, and copy its contents into a `config.js` file in the repository folder.
8. Reboot the raspberry pi

If all of these steps have been followed correctly, the Greenhouse app should now display the current temperature for all thermometers connected to the Raspberry Pi.  

