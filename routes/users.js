var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;  

  db.collection('users').find().toArray(function (err, items) {
    res.render('users', { title: 'Users', 'users': items });
  });
});

module.exports = router;
