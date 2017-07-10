var express = require('express');
var router = express.Router();
var checkSession = require('../jsbean/CheckSession');
var questionModel = require('../models/EmotionModel');

router.all('/ask',function(req,res){
  loginbean = checkSession.check(req,res);
  if(!loginbean){return;}
  subflag = req.body['subflag'];
  if(subflag==undefined){
    res.render('emotion',{loginbean:loginbean});
  }else{
    //发提问
    questionModel.ask(req,res);
  }
});
router.get('/detail',function(req,res){
  // res.send('查看详情');
  questionModel.queDetail(req,res);
})
router.post('/reply',function(req,res){
  loginbean = checkSession.check(req,res);
  if(!loginbean){return;}
  subflag = req.body['subflag'];
  if(subflag!=undefined){
    questionModel.reply(req,res);
  }else{
    res.send('请用表单提交！');
  }
})
module.exports = router;