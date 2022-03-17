const express = require("express");
const userHandler = require('../router_handler/user')
const router = express.Router()
// 注册新用户
router.post('/reguser', userHandler.regUser)
// 登录
router.get('/login', userHandler.login)
module.exports = router