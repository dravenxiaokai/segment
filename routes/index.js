var express = require('express');
var router = express.Router();
//三个组件
var multiparty = require('multiparty');
var util = require('util');
var fs  = require('fs');

var questionModel = require('../models/QuestionModel');

/* GET home page. */
router.get('/', function(req, res, next) {
	loginbean = req.session.loginbean;
	console.log(loginbean);
	questionModel.queList(req,res,loginbean);
  // res.render('index', { loginbean: loginbean });
});
//注销
router.get('/logout',function(req,res){
	req.session.destroy(function(err){
		res.redirect('/');
	})
});
/*获取上传图片的post请求*/
router.post('/uploadImg',function(req,res){
	//创建一个multiparty中间件的一个表单对象
	var form = new multiparty.Form();
	//设置编码
	form.encoding = 'utf-8';
	//设置文件存储路径
	form.uploadDir = './uploadtemp/';
	//设置单文件大小限制
	form.maxFilesSize = 2 * 1024 * 1024;
	//form.maxFields = 1000; 设置所有文件的大小总和

	form.parse(req,function(err,fields,files){
		uploadurl = '/images/upload/';
		file1 = files['filedata'];
		// paraname = file1[0].fieldName;//参数名filedata
		originalFilename = file1[0].originalFilename;//原始文件名
		tmpPath = file1[0].path; //uploads\mrecQCv2cG1Zbj-UMjNyw_Bz.txt
		//fileSize = file1[0].size; //文件大小

		var timestamp = new Date().getTime();//获取当前时间戳
		//上传路由是时间戳加上原始文件名
		uploadurl += timestamp+originalFilename;
		//新的要保存到服务器的地址
		newPath = './public'+uploadurl;
		//创建文件读出流
		var fileReadStream = fs.createReadStream(tmpPath);
		//创建文件写入流
		var fileWriteSteam = fs.createWriteStream(newPath);
		fileReadStream.pipe(fileWriteSteam);//管道流
		fileWriteSteam.on('close',function(){
			fs.unlinkSync(tmpPath);//删除临时文件夹中的图片
			console.log('copy over!');
			res.send('{"err":"","msg":"'+uploadurl+'"}');
		})
	})
})
// router.get('/ab*cd',function(req,res){
// 	console.log('ab*cd请求!');
// 	res.send('正则匹配');
// })

module.exports = router;
