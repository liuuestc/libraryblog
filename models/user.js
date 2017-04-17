//站长登陆数据库,暂时只有站长的用户名和密码 ，可以扩展多个文章发表者，数据为从服务端直接插入。
//如果扩展则为注册时，数据库结构
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/* ********************************************
 USER SCHEMA,
 ******************************************** */
var userSchema = new Schema({
    name: String, //用户名唯一
    email: {type: String, unique:true}, //邮箱地址唯一
    password:String, //加密后的密码
    createdOn: { type: Date, default: Date.now }, //创建时间
    lastLogin: {type: Date, default: Date.now}   //最后修改时间
});
// Build the User model
var User = mongoose.model( 'User', userSchema );
