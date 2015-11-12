Thermostaat
==============

Thermostaat is a little app that shows the current temperature and humidity.
If you have a (PIR) motion sensor, it can show if there's some movement too.


## Installation

clone this repo and run:
npm install


## Wiring
![Alt text](https://raw.githubusercontent.com/Jan-Bart/Thermostaat/master/doc/schema.png "Wiring schema")

## Screenshots
![Alt text](https://raw.githubusercontent.com/Jan-Bart/Thermostaat/master/doc/screens.jpg "Screenshots")

## Notes

You need to be root to run an application on a port under 1024
but because I didn't like the fact of running the frontend app as root
we run the app on port 3000 (as usual) and forward port 80 to 3000

=> sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
