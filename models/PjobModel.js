var connPool = require('./ConnPool');
var async = require('async');
module.exports = {
  ask:function(req,res){
    loginbean = req.session.loginbean;
    pool = connPool();
    pool.getConnection(function(err,conn){
      var userAddSql = 'insert into pjob (phone,qq,pay,title,content,uid,nicheng,createtime) values (?,?,?,?,?,?,?,current_timestamp);';
      var param = [req.body['phone'],req.body['qq'],req.body['pay'],req.body['title'],req.body['content'],loginbean.id,loginbean.nicheng];
      console.log(param);
      conn.query(userAddSql,param,function(err,rs){
        if(err){
          res.send("<script>alert('数据库错误：');history.back();</script>");
          return;
        }
        // res.redirect('../');
        res.send("<script>alert('发表成功！');location.href='../';</script>")
      });
      conn.release();
    });
  },
  queList:function(req,res,loginbean){
    pool = connPool();
    //从pool中获取连接（异步，取到后回调）
    pool.getConnection(function(err,conn){
      if(err){
        res.send('获取连接错误：'+err.message);
        return;
      }
      var page = 1;
      if (req.query['page']!=undefined){
        page = parseInt(req.query['page']);
        if(page<1){page = 1;}
      }
      pageSize = 2;
      pointStart = (page-1)*pageSize;
      count = 0;
      countPage = 0;

      var countSql = 'select count(*) from pjob;';
      var listSql = 'select pid,title,looknum,updtime,createtime from pjob order by pid desc limit ?,?';
      var param = [pointStart,pageSize];

      async.series({     
          one: function(callback){
            conn.query(countSql,[],function(err,rs){
              count = rs[0]['count(*)'];
              countPage = Math.ceil(count/pageSize);
              if (page>countPage) {
                page = countPage;
                pointStart = (page-1)*pageSize;
                param = [pointStart,pageSize];
              }
              callback(null, rs);
            });
          },     
          two: function(callback){
            conn.query(listSql,param,function(err,rs){
            // if(err){
            //  // res.send('注册错误：'+err.message);
            //  errStr = err.message;
            //  sendStr = "<script>";
            //  sendStr += errStr;
            //  sendStr += "history.back();</script>";
            //  res.send(sendStr);
            //  return;
            // }
            // console.log(rs);
            callback(null, rs);
          });
          }
      },function(err, results) {
          // console.log(results);
          // count = results['one'][0]['count(*)'];
          // countPage = Math.ceil(count/pageSize);
          rs = results['two'];

          res.render('pjobdetail', { loginbean: loginbean,page:page,rs:rs,count:count,countPage:countPage});
          // res.send('查完');
      });

      
      conn.release();
    });
  },
  queDetail:function(req,res){
    pid = req.query['pid'];
    if(pid!=undefined){
      /*学习文章列表*/
      var listSql = 'select pid,phone,qq,pay,title,looknum,updtime,createtime from pjob order by sid desc';
      var listparam = [];
      /*学习文章列表*/
      sqlupd = 'update pjob set looknum = looknum+1 where pid = ?;';
      sqldetail = "select pid,phone,qq,pay,title,content,uid,nicheng,looknum,updtime,date_format(createtime,'%Y-%c-%d') as createtime from pjob where pid = ?;";
      param = [pid];
      sqlreplay = "select prpid,content,uid,nicheng,date_format(createtime,'%Y-%c-%d') as createtime from pjobreplies where pid = ?;";
      pool = connPool();
      //从pool中获取连接（异步，取到后回调）
      pool.getConnection(function(err,conn){
        if(err){
          res.send('获取连接错误：'+err.message);
          return;
        }
        var page = 1;
        if (req.query['page']!=undefined){
          page = parseInt(req.query['page']);
          if(page<1){page = 1;}
        }
        async.series({     
            one: function(callback){
              conn.query(sqlupd,param,function(err,rs){
                callback(null, rs);
              });
            },     
            two: function(callback){
              conn.query(sqldetail,param,function(err,rs){
              callback(null, rs);
            });
            },
            three:function(callback){
              conn.query(sqlreplay,param,function(err,rs){
              callback(null, rs);
            });
            },
            pjoblist:function(callback){
              conn.query(listSql,listparam,function(err,rs){
                callback(null,rs);
              })
            }
        },function(err, results) {
            console.log(results);
            // count = results['one'][0]['count(*)'];
            // countPage = Math.ceil(count/pageSize);
            rs = results['two'];
            rsReply = results['three'];
            rsList = results['pjoblist'];
            console.log('===================\n'+rsList+'\n==============');
            loginbean = req.session.loginbean;
            res.render('pjobdetail', {loginbean:loginbean,rs:rs,rsReply:rsReply,rsList:rsList});
            // res.send('查完');
        });

        conn.release();
      });
    }else{
      res.send('没传入pid');
    }
  },
  reply:function(req,res){
    loginbean = req.session.loginbean;
    pool = connPool();
    sql1 = 'insert into pjobreplies (pid,content,uid,nicheng) values (?,?,?,?);'
    param1 = [req.body['pid'],req.body['content'],loginbean.id,loginbean.nicheng];
    sql2 = 'update pjob set renum=renum+1 where pid = ?;';
    param2 = [req.body['pid']];
    pool.getConnection(function(err,conn){
      if(err){
        console.log('有错！');
        res.send('拿不到连接：'+err.message);
        return;
      }
      conn.beginTransaction(function(err){
        if(err){
          console.log('有错11111');
          res.send('启动事务处理出错');
          return;
        }
        async.series([ //串行series,并行parallel
          function(callback){
            conn.query(sql1,param1,function(err,rs){
                            if(err){
                                console.log('有错'+err.message);
                                callback(err,1);
                                return;
                            }
                            //console.log('执行第1条完毕');
                            callback(err,rs);//没有则callback(null,1);第2个参数是返回结果
                        });
          },function(callback){
            conn.query(sql2,param2,function(err,rs){
                            if(err){
                                console.log('有错'+err.message);
                                callback(err,2);
                                return;
                            }
                            //console.log('执行第1条完毕');
                            callback(err,rs);//没有则callback(null,1);第2个参数是返回结果
                        });
          }
        ],function(err,result){
           console.log(result);
                    if(err) {
                        console.log('调用回滚1');
                        conn.rollback(function() {
                            //throw err;
                        });
                        res.send('数据库错误:'+err);
                        return;
                    }
                     // 提交事务
                    conn.commit(function(err) {
                        if (err) {
                            console.log('调用回滚2');
                            conn.rollback(function() {
                                //throw err;
                            });
                            res.send('数据库错误:'+err);
                            console.log('提交事物出错');
                        }
                        res.redirect('./detail?pid='+req.body['pid']);
                        // res.send('回复成功');
                        // console.log('success!');
                    });
        });
      });
      conn.release();
    });
  }
}