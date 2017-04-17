var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db1 = require('../models/article'),
    mongoose = require('mongoose'),
    Poster = mongoose.model('Poster'),
    HotPost = mongoose.model('HotPost');

/* GET users listing.
* 处理文章编辑逻辑
* 最重要的js文件
* */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create',function (req, res) {
   if(req.session.isLogin == true);
       res.render('post',{title: '编辑博文！'});
    //需要修改为首页
    res.redirect('/');
});

//将文章存储到数据库中。
router.post('/create', function (req, res) {
    if(req.session.isLogin == true){
        Poster.create({
            subject: req.body.subject,
            tags : req.body.tags,
            title: req.body.title,
            content : req.body.thecontent,
            author: req.session.username
        }, function (err, post) {
            if (!err){
                console.log('文章创建成功！');
                var date = processDateString(post.createdOn);
                res.render('posted',{subject:post.subject, tags:post.tags, title: post.title,content: post.content,author : post.author, createOn: date, readNum: post.readNum,id: post._id});
            }
            if (!post){
                console.log("文章创建失败！");
                res.redirect('/articles/create');
            }
        });
    }else {
        req.redirect('/');
    }

    //console.log(req.body);

});
//用于编辑文章使用
router.get('/edit/:id',function (req,res) {
   if(req.session.isLogin == true){
       Poster.findById(
           req.params['id']
           ,function (err, post) {
               if(!err){
                   if(!post){
                       res.send('<h2>文章获取失败</h2>')
                   }else {
                       res.render('edit',{id: post._id, tags: post.tags, title : post.title, content: post.content, subject :post.subject});
                   }
               }
               else {
                   res.send('<h2>编辑失败</h2>');
               }
           });
   }
    else res.redirect('/');
});
router.post('/edit/:id', function (req, res) {
   if (req.session.isLogin == true){
       Poster.findByIdAndUpdate(
           req.params['id']
           ,{
               //文章的类别
               tags: req.body.tags,     //文章系类
               title:  req.body.title,   //文章的标题
               modifyOn:  {type: Date,default:Date.now},
               content: req.body.thecontent,
               subject: req.body.subject
           }//最后修改时间
           ,{
               new :true,
               upsert: true
           }
           ,function (err,post) {
               if (!err){
                   if(!post){
                       console.log('文章修改失败');
                       res.send("<h2>文章修改失败</h2>");
                   }else {
                       res.render('posted',{subject:post.subject, tags:post.tags, title: post.title,content: post.content,author : post.author, createOn: post.createdOn, readNum: post.readNum,id: post._id});
                   }

               }else {
                   res.send('文章修改失败！')
                   //res.render('/articles/edit/'+req.params['id']);
               }
           });
   }
    else res.redirect('/');
});
//处理图片有kindeditor上传
router.post('/uploadImg', function (req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../public/uploadImg';
    form.parse(req, function (err, fields, files) {
        if (err) {
            throw err;
        }
        var image = files.imgFile;
        var path = image.path;
        path = path.replace('/\\/g', '/');
        var url = '/uploadImg' + path.substr(path.lastIndexOf('/'), path.length);
        var info = {
            "error": 0,
            "url": url
        };
        res.send(info)
    });
});
//获取某一类型的文章,这个函数用于后面的使用。
router.get('/class/:category/:id',function (req, res) {
   var category = req.params['category'],
       id = req.params['id'];
    //防止有恶意输入的数据
    if(id < 0){
        id = 0;
    }
    Poster.count(
        {'subject':category}
        ,function (err, counter) {
            if(!err){
                if (!counter){
                    res.send('<h2>本类别没有文章</h2>')
                }else {
                    Poster.find(
                        {subject: category},
                        'title tags readNum createdOn _id',
                        {sort: {'_id' : -1},skip:parseInt(req.params['id'])*8,limit: 8},
                        function (err, poster) {
                            if(!err){
                                if (!poster){
                                    res.send('<h2>没有更多文章了！</h2>');
                                }

                                var page = '';
                                var titles = '';
                                var length = poster.length;
                                for (var i = 0; i < length ; i ++){
                                    titles += hotToTitle(poster[i],i);
                                }
                                var idnext = (parseInt(id)+1);
                                if (length != 8){
                                    idnext = parseInt(id);
                                }

                                var pre = "<li><a href='javascript:;' onclick='nextPage(this.name)' name = /articles/class/"+category+"/"+(parseInt(id)-1)+"'>Prev</a></li>";
                                var next = "<li><a href='javascript:;' onclick='nextPage(this.name)' name = /articles/class/"+category+"/"+idnext+"'>Next</a></li>";
                                //编辑下面的分页
                                for (var j = 0; j < (counter-1)/8 ;j++){
                                    page = page + "<li> <a href='javascript:;' onclick='nextPage(this.name)' name =/articles/class/"+category+"/"+j+"'>  "+(j+1) + "</a></li>";
                                }

                                res.render('titles',{titles: titles,pages:pre+page+next});
                            }
                            if (!poster){
                                res.render('<p>没有更多的文章了</p>');
                            }
                        });
                }

            }else {
                res.send('<h2>获取列表失败</h2>')
            }
        });
});

router.get('/createHot', function (req, res) {
    if (req.session.isLogin == true){
        HotPost.remove({},function (err,data) {
            if(!err){
                //下面的代码以后移动到上面,必须登陆后才可以查看。
                findHot('Language');      //这里由于是异步的所以不能同时返回
                findHot('Ideology');
                findHot('China');
                findHot('Foreign');
                res.send('<h2>创建成功！</h2>');
            } else {
                console.log('删除失败！');
                res.send('<h2>创建失败</h2>')
            }
        });
    }
    else res.redirect('/');
});
//将获取博客类别的主页换成下面的函数。
router.get('/hot', function (req, res) {
    HotPost.find(
        function (err, data) {
            if(!err){
                var titles = new Array(4);
                var num = data.length;
                for (var i =0 ;i < num; i++){
                    switch (data[i]['subject']){
                        case 'Language' :
                            titles[0] = hotToTitle(data[i],0);
                            break;
                        case 'Ideology' :
                            titles[1] = hotToTitle(data[i],1);
                            break;
                        case 'China':
                            titles[2] = hotToTitle(data[i],2);
                            break;
                        case 'Foreign':
                            titles[3] = hotToTitle(data[i],3);
                            break;
                    }
                }
                res.render('blog',{hotTitle1: titles[0],hotTitle2: titles[1],hotTitle3: titles[2],hotTitle4 : titles[3]});
            }
        });
});
//获取文章函数,并且更新阅读数量：
router.get('/article/:id', function (req, res) {
    var id = req.params['id'];
    Poster.findByIdAndUpdate(id,
        {$inc:{readNum:1}}
    ,function (err, post) {
        var subject = post;
       if (!err){
           if (!post){
               console.log('文章找不到了');
               res.send('<p>文章找不到了！</p>')
           }else {
               var title = "<h2 style='text-align: center'>"+ subject['title'] +"</h2>"+
                   "<p style='margin-top: 5px;margin-bottom: 0px; text-align: center'><small>阅读量：" + subject['readNum'] +
                   " 日期： " + subject['createdOn']+
                   "标签：" + subject['tags']+ "</small></p>";
               res.render('article',{title: title, post:post['content']});
           }

       }
       else {
           res.send("<p>查找文章失败！</p>")
       }
    });
});
function processDateString(date) {
    var dt = new Date(date.toString());
    return dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
}
//数据库插入最新文章函数,
function findHot(subject) {
    Poster.find(
        {subject: subject},
        {},
        {sort: {readNum :-1, _id: -1}},
        function (err, data) {
            if(!err){
                if(data != ''){
                    HotPost.create({
                        id: data[0]['_id'],
                        subject: data[0]['subject'],  //文章的类别
                        tags: data[0]['tags'],     //文章系类
                        title:  data[0]['title'],   //文章的标题
                        author:data[0]['author'],    //作者
                        readNum: data[0]['readNum'], //文章的阅读量
                        createdOn: processDateString(data[0]['createdOn'] )//创建时间
                    },function (err, hotPost) {
                       if (!err){
                           console.log('查找完毕！')
                       }
                       if (!hotPost)
                           return null
                    });

                }
            }
            else{
              console.log('获取数据失败！');
                return null;
            }
        }
    )
}
//将最新文章抽取的数据转换成html
function hotToTitle(subject,i) {
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a onclick='return false;' href='/articles/article/"+subject['_id']+"'> "+ subject['title']+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>阅读量：" + subject['readNum'] +
        " 日期： " + subject['createdOn'] +
        "标签：" + subject['tags']+ "</small></p></div> ";
    return title;
}
//
module.exports = router;
