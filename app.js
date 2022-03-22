const express = require("express");
const cors = require('cors')
const app = express()
const userRouter = require('./router/user');
const Joi = require("joi");
const expressJWT = require('express-jwt')
const config = require('./config')
const userinfoRouter = require('./router/userinfo')
const artCateRouter = require('./router/artcate')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 响应数据中间件
app.use((req, res, next) => {
    // 封装全局错误处理中间件
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/] }))
app.use('/api', userRouter)
app.use('/my', userinfoRouter)
app.use('/my/article', artCateRouter)
// 错误中间件
app.use((err, req, res, next) => {
    // 数据验证
    if (err instanceof Joi.ValidationError) return res.cc(err)
    // 身份认证错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 验证失败
    res.cc(err)
})
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})