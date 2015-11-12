#!/usr/bin/python

import RPi.GPIO as GPIO
import time
import datetime
import MySQLdb
import urllib2

sensor = 26

GPIO.setmode(GPIO.BCM)
GPIO.setup(sensor, GPIO.IN, GPIO.PUD_DOWN)

previous_state = False
current_state = False

while True:
        time.sleep(0.1)
        previous_state = current_state
        current_state = GPIO.input(sensor)
        if current_state != previous_state:
                new_state = "HIGH" if current_state else "LOW"
                print("GPIO pin %s is %s" % (sensor, new_state))
                current_date = time.strftime('%Y-%m-%d %H:%M:%S')
                print (current_date + ' Status: ', current_state)
                # connect to database
                db = MySQLdb.connect("HOST","DATABASE", "PASSWORD", "USERNAME")
                x = db.cursor()
                try:
                        x.execute("""INSERT INTO th_alarm VALUES (%s,%s,%s)""", (db.insert_id(), current_date, current_state))
                        db.commit()
                except:
                        db.rollback()
                db.close()

                req = urllib2.Request('http://localhost:3000/refresh-alarm')
                try:
                        r = urllib2.urlopen(req)
                except urllib2.HTTPError as e:
                        print(e.reason)
