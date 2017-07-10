var express = require('express');
var router = express.Router();
var checkSession = require('../jsbean/CheckSession');
var questionModel = require('../models/QuestionModel');

router.get('/study',function(req,res){
  res.render('studydetail')
})
// router.get('/studydetail',function(req,res){
//   res.render('studydetail')
// })
router.get('/pjob',function(req,res){
  res.render('pjob')
})
router.get('/pjobdetail',function(req,res){
  res.render('pjobdetail')
})
router.get('/fashion',function(req,res){
  res.render('fashion')
})
router.get('/fashiondetail',function(req,res){
  res.render('fashiondetail')
})
router.get('/emotion',function(req,res){
  res.render('emotion')
})
router.get('/emotiondetail',function(req,res){
  res.render('emotiondetail')
})
router.get('/chat',function(req,res){
  res.render('chat')
})

module.exports = router;