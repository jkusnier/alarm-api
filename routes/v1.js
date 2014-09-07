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
