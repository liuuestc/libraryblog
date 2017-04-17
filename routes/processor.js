var express = require('express');
var router = express.Router();
var db2 = require('../models/article');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var Poster = mongoose.model('Poster');
/* GET users listing.
* 处理来访者访问逻辑
* */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//处理留言的逻辑
router.post('/contact', function (req, res) {
  Message.create({
      firstName : req.body.firstname,
      lastName : req.body.lastname,
      emailAddress : req.body.email,
      subject : req.body.subject,
      message : req.body.message
      },
  function (err, message) {
    if(!err){
      console.log('留言成功');
      res.json({'status' : 'ok'});
    }
    if (!message){
      console.log('留言存储失败！');
      res.json({'status' : 'error'});
    }
  });
});

module.exports = router;
