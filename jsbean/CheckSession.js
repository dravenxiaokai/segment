module.exports = {
	check:function(req,res){
		loginbean = req.session.loginbean;
		if(loginbean==undefined){
			res.send("<script>alert('登陆过期，请重新登陆！');location.href='/';</script>")
			return;
		}
		return loginbean;
	}
}