const db = require("../db")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
exports.regUser = (req, res) => {
    const userinfo = req.body
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({ status: 1, message: '用户名或者密码不能为空' })
    //     return res.cc('用户名或者密码不能为空')
    // }

    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.send({ status: 1, message: err.message })
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名!')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into ev_users set ?'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断 SQL 语句是否执行成功
            //   if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err.message)
            // 判断影响行数是否为 1
            // if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
            //   注册用户成功
            // res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 0)
        })
    })
}

exports.login = (req, res) => {
    const userinfo = req.body
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('登录失败！')

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc
        }

        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status:0,
            message:'登录成功!',
            token:'Bearer ' + tokenStr
        })
    })
}
