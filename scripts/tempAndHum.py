#!/usr/bin/python

import json
import sys
import time
import datetime
import MySQLdb
import urllib2
import Adafruit_DHT
from oauth2client.client import SignedJwtAssertionCredentials

# Type of sensor, can be Adafruit_DHT.DHT11, Adafruit_DHT.DHT22, or Adafruit_DHT.AM2302.
DHT_TYPE = Adafruit_DHT.DHT22

# Example of sensor connected to Raspberry Pi pin 23
DHT_PIN  = 4

# How long to wait (in seconds) between measurements.
FREQUENCY_SECONDS      = 30

# connect to database
db = MySQLdb.connect("HOSTNAME","DATABASE", "PASSWORD", "USERNAME")

# Attempt to get sensor reading.
humidity, temp = Adafruit_DHT.read(DHT_TYPE, DHT_PIN)

# Skip to the next reading if a valid measurement couldn't be taken.
# This might happen if the CPU is under a lot of load and the sensor
# can't be reliably read (timing is critical to read the sensor).
if humidity is None or temp is None:
	time.sleep(2)
	#continue

# Append the data in the spreadsheet, including a timestamp
printTemp =  '{0:0.1f}'.format(temp).replace('.', ',')
printHum =  '{0:0.1f}'.format(humidity).replace('.', ',')

print datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S') + ' T: ' + printTemp + ' H: ' + printHum

x = db.cursor()

try:
	x.execute("""INSERT INTO th_values VALUES (%s,%s,%s,%s)""",(db.insert_id(),datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S'), printTemp, printHum))
	db.commit()
except:
	db.rollback()

db.close()

req = urllib2.Request('http://localhost:3000/refresh')
try:
	r = urllib2.urlopen(req)
except urllib2.HTTPError as e:
	print(e.reason)
