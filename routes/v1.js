var express = require('express');
var router = express.Router();

router.get('/devices', function(req, res) {
  var db = req.db;  
  db.collection('devices').find().toArray(function (err, items) {
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
  db.collection('devices').findOne({_id: req.params.device_id}, function(err, result) {
    var alarms = result.alarms;
    res.json(alarms);
  });
});

router.get('/devices/:device_id/alarms/next', function(req, res) {
  var db = req.db;
  db.collection('devices').findOne({_id: req.params.device_id}, function(err, result) {
    var timeZone = result.timeZone;
    var now = new Date;
    // Not sure if we'll need to adjust to UTC
    var local = now;
    // var local = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()) + (timeZone * 3600000));
    var currentTime = (local.getHours() * 60) + (local.getMinutes());
    var currentDay = local.getDay() + 1; // Spark Days Sunday = 1 Saturday = 7
    
    var nextAlarm;
    var alarms = result.alarms;
    // FIXME this is very inefficient and could probably be handled by mongo once I know it better
    alarms.forEach(function(alarm) {
      if (alarm.time > currentTime && alarm.dayOfWeek.indexOf(currentDay) >= 0) { // Check for alarms today
        if (nextAlarm && alarm.time < nextAlarm.time) { // We want the earliest alarm 
          nextAlarm = alarm;
        }
      }
    });
    // No alarms set. Find next alarm that is closest to today
    if (!nextAlarm) {
      // Create array of days starting with tomorrow
      var days = [];
      for (i=0; i<7; i++) {
        var day = currentDay + (i + 1);
        if (day > 7) {
          day = day - 7;
        }
        days[i] = day;
      }
      
      // nextAlarm = alarms[0];
      alarms.forEach(function(alarm) {
        if (!nextAlarm) {
          nextAlarm = alarm;
        } else {
          // Alarm must be lower time of day or a closer day of week to override
          days.forEach(function(day) {
            if (alarm.time < nextAlarm.time && alarm.dayOfWeek.indexOf(day) >= 0 && nextAlarm.dayOfWeek.indexOf(day) >= 0) {
              nextAlarm = alarm;
              return false;
            }
          });
        }
      });
    }
    
    res.json(nextAlarm);
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
