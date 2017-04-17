var express = require('express');
var router = express.Router();
var db = require('../models/user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
/* GET users listing.
* 处理站长登陆逻辑
* */

//站长登陆
router.get('/login/starfarmingl', function(req, res, next) {
  res.render('login');
});



//站长登陆响应函数，如果登陆成功转到站长后台界面，后台界面可以发表文章
router.post('/login', function (req, res) {
  if (req.body.username == '' || req.body.password == '')
    res.redirect('/users/login');
  User.findOne(
      {'name' : req.body.username, 'password' : req.body.password},
      function (error, user) {
        if (error) {
          console.log(error);
          res.render('/error');
        }
        if(user){
            req.session.username = user.name;
            req.session.isLogin = true;
            res.redirect('/users/backend/'+user.name);
        }
      }
  );
});
//返回界面

router.get('/backend/:username',function (req, res) {
  if (req.session.username == req.params['username']){
    res.render('profile', {title : '个人主页',name:req.params['username']});
  }
});

//下面的函数不是一直开放。
router.get('/create',function (req,res) {
    res.render('reg');
});
//用户注册时处理函数，不开放。
router.post('/create',function (req, res) {
        console.log("创建用户");
        console.log(req.body);
        if (req.body.username == '' || req.body.email == '' ||req.body.password == ''){
            res.redirect('/users/reg');
        }
        User.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            createOn: Date.now(),
            lastLogin: Date.now()
        },function (err,user) {
            if(!err){
                console.log("user create and saved!");
                req.session.username = user.name;
                req.session.isLogin = true;
                res.redirect('/users/backend/'+user.name);
            }else{
                if(err.code == '11000'){
                    res.send("邮箱已经注册")
                }
            }
            if (!user){
                res.send("用户创建失败");
            }
        });
});

module.exports = router;
