var express = require('express');
var router = express.Router();
var db4 = require('../models/article'),
    mongoose = require('mongoose'),
    Poster = mongoose.model('Poster'),
    HotPost = mongoose.model('HotPost');
var db2 = require('../models/uploadFile'),
    Upload = mongoose.model('Upload'),
    FileCmt = mongoose.model('FileCmt');
/*
 *
 *GET home page.
 * 主要用来展示主页的逻辑
 * （最终结果）每次打开传送不同的文章段落
 *
 * */
router.get('/', function(req, res) {
    var id = 0,
        category = '';
    Upload.count(
        {}
        ,function (err, counter) {
            if(!err){
                if (!counter){
                    res.render('index',{titles: '<h2 style="margin-left: 30%">没有更多文档了！</h2>',pages:''});
                }else {
                    Upload.find(
                        {},
                        'fileName name times createdOn _id',
                        {sort: {'_id' : -1},limit: 8},
                        function (err, poster) {
                            if(!err){
                                if (!poster){
                                    res.send('<h2>没有更多文章了！</h2>');
                                }

                                var page = '';
                                var titles = '';
                                var length = poster.length;
                                for (var i = 0; i < length ; i ++){
                                    titles += toTitle(poster[i],i);
                                }
                                var idnext = (parseInt(id)+1);
                                if (length != 8){
                                    idnext = parseInt(id);
                                }

                                var pre = "<li><a href='javascript:;' onclick='nextPage(this.name)' name = /doc/"+(parseInt(id)-1)+"'>Prev</a></li>";
                                var next = "<li><a href='javascript:;' onclick='nextPage(this.name)' name = /doc/"+idnext+"'>Next</a></li>";
                                //编辑下面的分页
                                for (var j = 0; j < (counter-1)/8 ;j++){
                                    page = page + "<li> <a href='javascript:;' onclick='nextPage(this.name)' name =/doc/"+j+"'>  "+(j+1) + "</a></li>";
                                }

                                res.render('index',{titles: titles,pages:pre+page+next});
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


router.get('/doc/:id', function(req, res) {
    var id = req.params['id'],
        category = '';

    if(id < 0){
        id = 0;
    }
    Upload.count(
        {}
        ,function (err, counter) {
            if(!err){
                if (!counter){
                    res.send('<h2>本类别没有文章</h2>')
                }else {
                    if (parseInt(id) > counter) id = 0;
                    Upload.find(
                        {},
                        'fileName name times createdOn _id',
                        {sort: {'_id' : -1},skip:parseInt(id)*8,limit: 8},
                        function (err, poster) {
                            if(!err){
                                if (!poster){
                                    res.send('<h2>没有更多文章了！</h2>');
                                }
                                var page = '';
                                var titles = '';
                                var length = poster.length;
                                for (var i = 0; i < length ; i ++){
                                    titles += toTitle(poster[i],i);
                                }
                                var idnext = (parseInt(id)+1);
                                if (length != 8){
                                    idnext = parseInt(id);
                                }

                                var pre = "<li><a href='javascript:;' onclick='nextPage(this.name)' name = /doc/"+(parseInt(id)-1)+"'>Prev</a></li>";
                                var next = "<li><a href='javascript:;' onclick='nextPage(this.name)' name = /doc/"+idnext+"'>Next</a></li>";
                                //编辑下面的分页
                                for (var j = 0; j < (counter-1)/8 ;j++){
                                    page = page + "<li> <a href='javascript:;' onclick='nextPage(this.name)' name =/doc/"+j+"'>  "+(j+1) + "</a></li>";
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

router.get('/doc/docName/:Name',function (req, res) {
    res.render('files',{title:'标题名', filename: '文件名'});
});

router.get('/about', function (req, res) {
    res.render('about');
});

router.get('/blog',function (req, res) {
    //if(1) res.redirect('/');
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

router.get('/error',function (req, res) {
    res.render('error');
});

//需要修改渲染的页面
router.get('/profile',function (req, res) {
    if(req.session.isLogin == true)
        res.render('portfolio');
    res.render('index');
});

router.get('/services',function (req, res) {
    if(req.session.isLogin == true)
        res.render('services');
    res.render('index');
});

router.get('/contact', function (req, res) {
   if(1) res.redirect('/');
   res.render('contact');
});

function hotToTitle(subject,i) {
    var title = "<div id='getBlog"+ i+ "'><a onclick='return false;' href='/articles/article/"+subject['id']+"'> "+ subject['title']+"</a></div> " +
        "<p style='margin-top: 5px;margin-bottom: 0px'><small>阅读量：" + subject['readNum'] +
        " 日期： " + subject['createdOn'] +
        "标签：" + subject['tags']+ "</small></p>";
    return title;
}
//与上面的代码相同，修改为使用js返回的代码
function toTitle(subject,i) {
    var dt = new Date(subject['createdOn']);
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a onclick='return false;' href='/upload/getdocProfile/"+subject['fileName']+"'> "+ subject['fileName'].split('->>')[0]+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>"+
        " 日期： " + dt.getFullYear() +"-"+ dt.getMonth() +"-" + dt.getDate()+
            '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() +
    "  by：" + subject['name']+ "</small></p></div> ";
    return title;
}
//正式使用的代码
function fileInfo(subject,i) {
    var dt = new Date(subject['createdOn']);
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a href='/upload/getdoc/"+subject['fileName']+"'> "+ subject['fileName'].split('->>')[0]+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>"+
        " 日期： " + dt.getFullYear() +"-"+ dt.getMonth() +"-" + dt.getDate()+
        "          作者：" + subject['name']+ "</small></p></div> ";
    return title;
}

module.exports = router;
