//文章编辑的数据库模式
//站长登陆数据库,暂时只有站长的用户名和密码 ，可以扩展多个文章发表者，数据为从服务端直接插入。
//如果扩展则为注册时，数据库结构
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/* ********************************************
 POST SCHEMA,
 ******************************************** */
var PostSchema = new Schema({
    subject: String,  //文章的类别
    tags: String,     //文章系类
    title:  String,   //文章的标题
    author:String,    //作者
    content: String,
    readNum: {type: Number, default: 0}, //文章的阅读量
    createdOn: { type: Date, default: Date.now }, //创建时间
    modifyOn: {type: Date, default: Date.now}   //最后修改时间
});
// Build the User model
var Poster = mongoose.model( 'Poster', PostSchema );

var hotSchema = new Schema({
    id : String,
    subject: String,  //文章的类别
    tags: String,     //文章系类
    title:  String,   //文章的标题
    author:String,    //作者
    readNum: {type: Number, default: 0}, //文章的阅读量
    createdOn: String, //创建时间
    myCreateOn:{type: Date,default: Date.now}
});

var HotPost = mongoose.model('HotPost', hotSchema);


var MessageSchema = new Schema({
    firstName :  String,
    lastName : String,
    emailAddress : String,
    subject : String,
    message : String,
    createOn : {type: Date, default:Date.now},
    readed : {type: Boolean , default: false}
});

var Message = mongoose.model('Message', MessageSchema);