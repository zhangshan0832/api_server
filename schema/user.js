const Joi = require("joi");

const username = Joi.string().alphanum().min(1).max(10).required()
const password = Joi.string().pattern(/^[\S]{6,12}$/).required()
const id = Joi.number().integer().min(1).required()
const nickname = Joi.string().required()
const email = Joi.string().email().required()
// 定义验证 avatar 头像的验证规则
const avatar = Joi.string().dataUri().required()

exports.reg_login_schema = {
    body: {
        username, password
    }
}
exports.update_userinfo_scheam = {
    body: {
        id,
        nickname,
        email
    }
}
exports.update_password_scheam = {
    body: {
        oldPwd: password, newPwd: Joi.not(Joi.ref('oldPwd')).concat(password)
    }
}
exports.update_avatar_schema = {
    body: {
        avatar
    }
}