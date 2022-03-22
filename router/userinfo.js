const express = require("express");
const router = express.Router()
const userinfo_handler = require('../router_handler/userinfo')
const expressJoi = require('@escook/express-joi')
const { update_userinfo_scheam, update_password_scheam, update_avatar_schema } = require("../schema/user");


router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_scheam), userinfo_handler.updateUserInfo)
// 重置密码
router.post('/updatepwd', expressJoi(update_password_scheam), userinfo_handler.updatepwd)

// 更换头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
module.exports = router