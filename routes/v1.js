var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/devices/:dev_id/alarms/next', function(req, res) {
  var db = req.db;
  var device_id = req.params.dev_id;

  db.collection('devices').findOne({_id: device_id}, function(err, result) {
    var timeZone = result.timeZone;
    var now = new Date;
    // Not sure if we'll need to adjust to UTC
    var local = now;
    // var local = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()) + (timeZone * 3600000));
    var currentTime = (local.getHours() * 60) + (local.getMinutes());
    var currentDay = local.getDay() + 1; // Spark Days Sunday = 1 Saturday = 7

    var nextAlarm;
    db.collection('alarms').findOne({deviceId: device_id, status: true, dayOfWeek: currentDay, time: {$gt: currentTime}}, {sort: "time"}, function(err, result) {
      if (result) {
        nextAlarm = result;
        nextAlarm.dayOfWeek = currentDay;
        res.json(nextAlarm);
      } else {
        // No alarms set. Find next alarm that is closest to today
        if (!nextAlarm) {
          db.collection('alarms').find({deviceId: device_id, status: true}, {sort: "time"}).toArray(function(err, items) {
            // Create array of days starting with tomorrow
            var days = [];
            for (i=0; i<7; i++) {
              var day = currentDay + (i + 1);
              if (day > 7) {
                day = day - 7;
              }
              days[i] = day;
            }

            days.forEach(function(day) { // Days sorted starting with tomorrow
              items.forEach(function(alarm) { // Alarms sorted by earliest time
                if (!nextAlarm && alarm.dayOfWeek.indexOf(day) >= 0) {
                  nextAlarm = alarm;
                  nextAlarm.dayOfWeek = day;
                  return false;
                }
              });
            });

            res.json(nextAlarm);
          });
        }
      }
    });
  });
});

router.post('/users', function(req, res) {
  var db = req.db;
  db.collection('users').findOne({_id: req.body.user_id, passwd: req.body.password}, function(err, result) {
    if (result) {
      res.json(result);
    } else {
      res.status(401).send({
        code : 401,
        error : "Unauthorized",
        error_description : "The credentials are invalid"
      });
    }

  });
});

router.use(function(req,res,next) {
  var db = req.db;
  var access_token = req.query.access_token;

  if (!access_token) {
    res.status(401).send({
      code : 401,
      error : "Unauthorized",
      error_description : "The access token was not found"
    });
  } else {
    db.collection('users').findOne({accessToken: access_token}, function(err, result) {
      if(err) {
        res.status(401).send({
          code : 401,
          error : "Unauthorized",
          error_description : err
        });
      } else if (result) {
        req.user = result;
        next();
      } else {
        res.status(401).send({
          code : 401,
          error : "Unauthorized",
          error_description : "The access token provided is invalid"
        });
      }
    });
  }
});

router.param('device_id', function(req,res,next,device_id) {
  if (device_id) {
    var devices = req.user.devices;
    var authorizedDevice = false;

    if (devices && devices.indexOf(device_id) >= 0) {
      authorizedDevice = true;
    }

    if (!authorizedDevice) {
      res.status(401).send({
        code : 401,
        error : "Unauthorized",
        error_description : "The device is invalid"
      });
      return;
    }
  }
  next();
});

router.get('/devices', function(req, res) {
  var db = req.db;
  var user = req.user;
  db.collection('devices').find({_id: {$in: user.devices}}).toArray(function (err, items) {
    res.json(items);
  });
});

router.get('/devices/:device_id', function(req, res) {
  var db = req.db;
  db.collection('devices').findOne({_id: req.params.device_id}, function(err, result) {
    res.json(result);
  });
});

router.get('/devices/:device_id/alarms', function(req, res) {
  var db = req.db;
  db.collection('alarms').find({deviceId: req.params.device_id}).toArray(function (err, items) {
    res.json(items);
  });
});

router.get('/devices/:device_id/alarms/:alarm_id', function (req, res) {
  var db = req.db;
  var mongo = req.mongo;
  db.collection('alarms').findOne({deviceId: req.params.device_id, _id: mongo.helper.toObjectID(req.params.alarm_id)}, function(err, result) {
    res.json(result);
  });
});

router.post('/devices/:device_id/alarms/:alarm_id', function (req, res) {
  var db = req.db;
  var mongo = req.mongo;

  var deviceId = req.params.device_id;
  var alarmId = mongo.helper.toObjectID(req.params.alarm_id);
  var status = req.body.status;
  var name = req.body.name;
  var time = req.body.time;
  var dayOfWeek = req.body.dayOfWeek;

  var updateValues = {};

  // TODO add validation and type safety
  if (typeof  status !== 'undefined') {
    updateValues.status = status;
  }
  if (typeof name !== 'undefined') {
    updateValues.name = name;
  }
  if (typeof  time !== 'undefined') {
    updateValues.time = parseInt(time);
  }
  if (typeof dayOfWeek != 'undefined') {
    updateValues.dayOfWeek = dayOfWeek;
  }

  db.collection('alarms').update({
    deviceId: deviceId,
    _id: alarmId
  }, {$set: updateValues}, function (err, result) {
    if (err) {
      res.status(500).send({
        code : 500,
        error : "Database Error",
        error_description : err
      });
    } else if (result == 1) {
      res.status(200).send();
    } else {
      res.status(400).send({
        code : 400,
        error : "Bad Request",
        error_description : "Alarm Not Found"
      });
    }
  });
});

router.put('/devices/:device_id/alarm', function (req, res) {
    var db = req.db;
    var mongo = req.mongo;

    var deviceId = req.params.device_id;
    var status = req.body.status;
    var name = req.body.name;
    var time = req.body.time;
    var dayOfWeek = req.body.dayOfWeek;

    var errorResponse = {};

    // TODO add validation and type safety
    if (typeof  status === 'undefined') {
        errorResponse.status = 'status is required';
    }
    if (typeof name === 'undefined') {
        errorResponse.name = 'name is required';
    }
    if (typeof  time === 'undefined') {
        errorResponse.time = 'time is required';
    }
    if (typeof dayOfWeek === 'undefined') {
        errorResponse.dayOfWeek = 'dayOfWeek is required';
    }

    if (errorResponse !== {}) {
        res.status(400).send(errorResponse);
    } else {

        res.status(501).send();
    }
});

router.get('/users', function(req, res) {
  var db = req.db;
  db.collection('users').findOne({accessToken: req.param('access_token')}, function(err, result) {
    res.json(result);
  });
});

module.exports = router;
