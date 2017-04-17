/**
 * Created by Administrator on 2016/11/24.
 */
/**
 * Created by liuuestc on 16-10-2.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/* ********************************************
 USER SCHEMA
 ******************************************** */
var studentSchema = new Schema({
    name: String, //用户名唯一
    number : String, //学号唯一
    id: String,
    score: String,
    isLoad: {type:Boolean,default:false} //是否提交,默认未提交
});



// Build the User model
var Student = mongoose.model( 'Student', studentSchema );

