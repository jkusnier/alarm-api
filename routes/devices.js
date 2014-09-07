var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;  

  db.collection('devices').find().toArray(function (err, items) {
    res.render('devices', { title: 'Devices', 'devices': items });
  });
});

module.exports = router;
