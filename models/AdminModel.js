var connPool = require('./ConnPool');
var LoginBean = require('../jsbean/LoginBean');
module.exports = {
  login:function(req,res){
    pool = connPool();
    //从pool中获取连接（异步，取到后回调）
    pool.getConnection(function(err,conn){
      if(err){
        res.send('获取连接错误：'+err.message);
        return;
      }
      var userSql = 'select uid,nicheng from admin where email=? and pwd=?';
      var param = [req.body['email'],req.body['pwd']];
      conn.query(userSql,param,function(err,rs){
        if(err){
          // res.send('注册错误：'+err.message);
          errStr = err.message;
          sendStr = "<script>";
          sendStr += errStr;
          sendStr += "history.back();</script>";
          res.send(sendStr);
          return;
        }
        console.log(rs);
        if(rs.length>0){
          loginbean = new LoginBean();
          loginbean.id = rs[0].uid;
          loginbean.nicheng = rs[0].nicheng;
          req.session.loginbean = loginbean;
          targeturl = req.body['targeturl'];
          res.redirect(targeturl);
          // res.send("<script>alert('登陆成功！');location.href='/';</script>");
        }else{
          res.send("<script>alert('email/密码错误！');history.back();</script>");
        }
      });
      conn.release();
    })
  }
}