const express = require("express");
const cors = require('cors')
const app = express()
const userRouter = require('./router/user');
const Joi = require("joi");
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

app.use('/api', userRouter)

// 错误中间件
app.use((err, req, res, next) => {
    // 数据验证
    if (err instanceof Joi.ValidationError) return res.cc(err)
    // 验证失败
    res.cc(err)
})
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})