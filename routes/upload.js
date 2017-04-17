//测试文件，不正式使用
var db1 = require('../models/Student'),
    mongoose = require('mongoose'),
    Student = mongoose.model('Student');
var express = require('express');
var router = express.Router();
var fs =require('fs'),
    path = require('path'),
    formidable = require('formidable');
/* GET home page. */

router.post('/new',function (req,res) {
    //判断上传是否合法，检查学号和姓名
    //如果合法，则改变上传的状态

    //存储上传的文件
    if (req.url == '/new' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';		//设置编辑
        form.uploadDir = 'public/upload/';	 //设置上传目录
        form.keepExtensions = true;	 //保留后缀
        form.maxFieldsSize = 10 * 1024 * 1024;   //文件大小
        //这里formidable会对upload的对象进行解析和处理
        form.parse(req, function(err, fields, files) {
            console.log(files.upload.name);
            if(files.upload.name == ''){
                fs.unlink(files.upload.path,function(){
                    res.redirect('/');}
                );
            }else{
                var newPath = form.uploadDir+files.upload.name+'-'+new Date();
                console.log(newPath);
                //for test
                console.log("New path"+newPath);
                fs.exists('newPath', function( exists ){
                    if(exists){
                        fs.unlink('newPath', function () {
                            fs.renameSync(files.upload.path,newPath);
                            console.log('success');
                            res.redirect('/');

                        })
                    }
                    else {
                        fs.renameSync(files.upload.path,newPath);
                        res.redirect('/upload/list');
                    }
                }) ;
                //end for test

            }
        });
        return;
    }
});

//获取文件列表
router.get('/list', function(req, res, next) {
    var type = req.params.types;
    fs.readdir("/var/www/blog/blog-master/public/upload", function (err, files) {
        if(err) {
            console.error(err);
            return;
        } else {
            files.forEach(function (file) {
                var filePath = path.normalize('/var/www/blog/blog-master/public/upload/' + file);
                //console.log(filePath);
                fs.stat(filePath, function (err, stat) {
                    if(stat.isFile()) {
                        // console.log(filePath + ' is: ' + 'file');
                    }
                    if(stat.isDirectory()) {
                        console.log(filePath + ' is: ' + 'dir');
                    }
                });
            });
        }
        res.render('document',{doucuments:files});
    });
});
//下载文件
router.get('/getdoc/:name',function (req,res) {
    var doc_path = 'public/upload/'+req.params['name'];
   res.download(doc_path,function (err) {
       if(err){
           res.redirect('/');
       }
   });
});

module.exports = router;

