var connPool = require('./ConnPool');
var LoginBean = require('../jsbean/LoginBean');
module.exports = {
	zhuce:function(req,res){
		pool = connPool();
		//从pool中获取连接（异步，取到后回调）
		pool.getConnection(function(err,conn){
			if(err){
				res.send('获取连接错误：'+err.message);
				return;
			}
			var userAddSql = 'insert into user (email,pwd,nicheng,createtime) values (?,?,?,current_timestamp)';
			var param = [req.body['email'],req.body['pwd'],req.body['nicheng'],req.body['createtime']];
			conn.query(userAddSql,param,function(err,rs){
				if(err){
					// res.send('注册错误：'+err.message);
					errStr = err.message;
					sendStr = "<script>";
					if(errStr.indexOf('emailuniq')>-1){
						sendStr += "alert('eamil重复！');";
					}else if(errStr.indexOf('nichenguniq')>-1){
						sendStr += "alert('昵称重复！);";
					}else{
						sendStr += "alert('数据库异常，稍后再试！')";
					}
					sendStr += "history.back();</script>";
					res.send(sendStr);
					return;
				}
				// res.send("<script>alert('注册成功！');location.href='/';</script>");
				//307重定向码，对于post请求，表示请求还没被处理完，客户端应该向location里的URL重新发起post请求。
				res.redirect(307,'./login');
			});
			conn.release();
		})
	},
	login:function(req,res){
		pool = connPool();
		//从pool中获取连接（异步，取到后回调）
		pool.getConnection(function(err,conn){
			if(err){
				res.send('获取连接错误：'+err.message);
				return;
			}
			//查询sql语句
			var userSql = 'select uid,nicheng from user where email=? and pwd=?';
			//前台提交的参数，代替sql中的占位符
			var param = [req.body['email'],req.body['pwd']];
			//执行query带参查询
			conn.query(userSql,param,function(err,rs){
				//如果数据库出错，页面弹出出错信息
				if(err){
					errStr = err.message;
					sendStr = "<script>";
					sendStr += errStr;
					sendStr += "history.back();</script>";
					res.send(sendStr);
					return;
				}
				//如果没有出错，控制台打印
				console.log(rs);
				//如果数据库有记录
				if(rs.length>0){
					//拿到封装的loginbean
					loginbean = new LoginBean();
					//将数据库查到的用户的id赋给LoginBean对象里面的id
					loginbean.id = rs[0].uid;
					//昵称同理
					loginbean.nicheng = rs[0].nicheng;
					//然后将这个对象赋给session里面的loginbean
					req.session.loginbean = loginbean;
					//拿到前台的目标地址
					targeturl = req.body['targeturl'];
					//登陆成功，重定向到目标地址
					res.redirect(targeturl);
				}else{
					//否则，邮箱或密码错误
					res.send("<script>alert('email/密码错误！');history.back();</script>");
				}
			});
			//释放连接
			conn.release();
		})
	}
}