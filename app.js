var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//路由
var index = require('./routes/index');
var users = require('./routes/users');
var question = require('./routes/question');
var study = require('./routes/study');
var emotion = require('./routes/emotion');
var pjob = require('./routes/pjob');
var fashion = require('./routes/fashion');
// var chat = require('./routes/chat');
var board = require('./routes/board');

//管理员路由
var admin = require('./routes/admin/admin.js');
//版主路由

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//设置上传临时文件夹
app.use(bodyParser({uploadDir:'./uploadtemp'}));
app.use(cookieParser());//必须在此行下面添加
app.use(session({
	secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
	cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒
	resave: true,  //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次 
	saveUninitialized: true //强制保存未初始化的会话到存储器
}))
app.use(express.static(path.join(__dirname, 'public')));
//视图引擎开启
app.use('/', index);
app.use('/users', users);
app.use('/question',question);
app.use('/study',study);
app.use('/emotion',emotion);
app.use('/pjob',pjob);
app.use('/fashion',fashion);
// app.use('/chat',chat);
app.use('/board',board);

//管理员的视图引擎
app.use('/admin',admin);
//版主的视图引擎

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
