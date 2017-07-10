var express = require('express');
var router = express.Router();
var userModel = require('../models/UserModel');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//GET请求与POST请求同时获取
router.all('/login',function(req,res,next){
	//标识符，获取前台页面提交的隐藏域
	subflag = req.body['subflag'];
	//subflag未定义，说明是get请求
	if(subflag==undefined){
		//浏览器响应渲染login视图
		res.render('login',{});
	}else{//否则，是POST请求
		//执行userModel里面的login()处理逻辑
		userModel.login(req,res);
	}
})
router.post('/zhuce',function(req,res,next){
	nicheng = req.body['nicheng'];
	console.log(nicheng);
	userModel.zhuce(req,res);
	// res.send('注册');
})
//query['name'] 只接受get传递的参数
// router.get('/zhuce/:id',function(req,res,next){
// 	console.log('bbbbbb========'+req.params.id);
// 	res.send('注册');
// })
// router.get('/list_user',function(req,res,next){
// 	console.log('list_user GET请求');
// 	res.send('用户列表页面');
// })
// //POST请求
// router.post('/',function(req,res){
// 	console.log('主页POST请求');
// 	res.send('Hello POST');
// })
// //POST，GET全接受
// router.all('/all',function(req,res){
// 	console.log('POST,GET请求全接受！');
// 	res.send('Hello all');
// })
// //输出html文件
// router.get('/aa',function(req,res){
// 	// res.sendFile('D:/expressdemo/segment/public/aa.html');//输出aa.html中的内容，路径为绝对路径
// 	// res.sendFile('E:/aa.html');
// 	res.sendFile('/expressdemo/segment/public/aa.html');
// })

module.exports = router;
