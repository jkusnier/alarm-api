alarm-api
=========

[![Build Status](https://travis-ci.org/jkusnier/alarm-api.svg?branch=master)](https://travis-ci.org/jkusnier/alarm-api)

GET

/devices/:device_id/alarms/next show next alarm for device

access_token is required for the following methods

/devices to list all devices you have access too

/devices/:device_id list details of device

/devices/:device_id/alarms list alarms for device

/devices/:device_id/alarms/:alarm_id single alarm for device

/users authenticate with access_token

POST

/devices/:device_id/alarms/:alarm_id update alarm

/users authenticate with username and password
