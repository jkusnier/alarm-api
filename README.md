alarm-api
=========

[![Build Status](https://travis-ci.org/jkusnier/alarm-api.svg?branch=master)](https://travis-ci.org/jkusnier/alarm-api)

/devices/:device_id/alarms/next [GET] show next alarm for device

*access_token is required for the following methods*

/devices [GET] to list all devices you have access too

/devices/:device_id [GET] list details of device

/devices/:device_id/alarms [GET] list alarms for device

/devices/:device_id/alarms/:alarm_id [GET, POST] single alarm for device

/users [GET, POST] authenticate with access_token or post username and password
