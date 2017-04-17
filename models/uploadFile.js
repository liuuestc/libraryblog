/**
 * Created by liuuestc on 17-4-11.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/* ********************************************
 UPLOAD SCHEMA,
 ******************************************** */
var uploadSchema = new Schema({
    fileName: String, //文件名唯一
    createdOn: { type: Date, default: Date.now }, //创建时间
    comment : {type: Number, default: 0},
    times: {type: Number, default: 0},
    name: String
});
// Build the Upload model
var Upload = mongoose.model( 'Upload', uploadSchema );

/***********************************************
 File comment Schema
 ************************************************ */

var fileCmtSchema = new Schema({
    fileName: String,     //文件名
    name : String,        //评论的人
    createOn : {type: Date, default: Date.now},  //创建的时间
    content : String      //内容
});
var FileCmt = mongoose.model('FileCmt', fileCmtSchema);