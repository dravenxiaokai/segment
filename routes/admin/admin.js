var express = require('express');
var router = express.Router();
var adminModel = require('../../models/AdminModel');
// var checkSession = require('../../jsbean/CheckSession');
// var questionModel = require('../../models/QuestionModel');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   loginbean = req.session.loginbean;
//   console.log(loginbean);
//   questionModel.queList(req,res,loginbean);
//   // res.render('index', { loginbean: loginbean });
// });
//注销
router.all('/login',function(req,res,next){
  subflag = req.body['subflag'];
  if(subflag==undefined){
    res.render('admin/login',{});
  }else{
    adminModel.login(req,res);
  }
})

router.get('/',function(req,res){
  loginbean = req.session.loginbean;
  res.render('admin/admin')
})

router.get('/logout',function(req,res){
  req.session.destroy(function(err){
    res.redirect('/admin/');
  })
});

router.get('/amoderator',function(req,res){
  res.render('admin/amoderator')
});
router.get('/auser',function(req,res){
  res.render('admin/auser')
});
router.get('/aquestion',function(req,res){
  res.render('admin/aquestion')
});
router.get('/aask',function(req,res){
  res.render('admin/aask')
});


module.exports = router;