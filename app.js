var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var upload = require('./routes/uploads');
var processor = require('./routes/processor');
var articles = require('./routes/article');

var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/PersionalBlog';
mongoose.connect(dbURI);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//用来存储站长信息。
app.use(session({
        secret: '685862',
        cookie: {maxAge: 80000000},
        resave: false,
        saveUninitialized: true
    }
    )
);
app.use('/', index);
app.use('/users', users);
app.use('/processor', processor);
app.use('/articles', articles);
app.use('/upload',upload);
//下面的代码用于测设使用

//以上的代码用于测试使用



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
    //添加了错误页面，后面到代码不会执行，最后可能需要删除。
    res.redirect('/');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//数据库状态记录
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
//进程结束时关闭与数据库的链接
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});


module.exports = app;
