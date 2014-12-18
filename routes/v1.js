var express = require('express');
var router = express.Router();

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
          db.collection('alarms').find({deviceId: device_id, status: true}).toArray(function(err, items) {
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

router.use(function(req,res,next) {
  var db = req.db;
  var access_token = req.query.access_token;

  if (!access_token) {
    res.status(400).send({
      code : 400,
      error : "invalid_request",
      error_description : "The access token was not found"
    });
  } else {
    db.collection('users').findOne({accessToken: access_token}, function(err, result) {
      if(err) {
        res.status(400).send({
          code : 400,
          error : "invalid_request",
          error_description : err
        });
      } else if (result) {
        req.user = result;
        next();
      } else {
        res.status(400).send({
          code : 400,
          error : "invalid_request",
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
      res.status(400).send({
        code : 400,
        error : "invalid_request",
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

router.get('/users', function(req, res) {
  var db = req.db;
  db.collection('users').find().toArray(function (err, items) {
    res.json(items);
  });
});

router.get('/users/:user_id', function(req, res) {
  var db = req.db;
  db.collection('users').findOne({_id: req.params.user_id}, function(err, result) {
    res.json(result);
  });
});

module.exports = router;
