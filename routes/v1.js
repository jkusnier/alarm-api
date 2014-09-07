var express = require('express');
var router = express.Router();

router.get('/devices', function(req, res) {
  var db = req.db;  
  db.collection('devices').find().toArray(function (err, items) {
    res.json(items);
  });
});

router.get('/users', function(req, res) {
  var db = req.db;
  db.collection('users').find().toArray(function (err, items) {
    res.json(items);
  });
});

module.exports = router;
