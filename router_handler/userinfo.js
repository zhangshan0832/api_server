const db = require('../db/index')
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => {
    // 定义sql查询语句
    const sqlStr = 'select id,username,nickname,email,user_pic from ev_users where id=?'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败!')
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0]
        })
    })
}

exports.updateUserInfo = (req, res) => {
    const sqlStr = 'update ev_users set ? where id=?'
    db.query(sqlStr, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        // 执行sql语句成功 但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc('更新用户基本信息失败！')
        res.cc('更新用户信息成功', 0)
    })
}

// 重置密码
exports.updatepwd = (req, res) => {
    const sql = `select * from ev_users where id=?`
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('旧密码错误！')
        const sqlStr = 'update ev_users set password=? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            // 判断影响的行数
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            // 成功
            res.cc('更新密码成功', 0)
        })
    })
}
// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 1. 定义更新头像的 SQL 语句
    const sql = `update ev_users set user_pic=? where id=?`
    // 2. 调用 db.query() 执行 SQL 语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 影响的行数是否等于 1
        if (results.affectedRows !== 1) return res.cc('更换头像失败！')
        // 成功
        res.cc('更换头像成功！', 0)
    })
}
