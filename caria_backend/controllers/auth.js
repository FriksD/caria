import mongoose from "mongoose"
import user from "../models/user.js"
import bcrypt from "bcryptjs"
import {createError} from "../error.js";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const verificationCodes = new Map();


export const sendVerificationCode = async (req, res, next) => {
    try {
        const {email} = req.body;
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes.set(email, verificationCode);

        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: "frisk2410006@outlook.com",
                pass: "ozwszabychbbvakw"
            }
        });


        await transporter.sendMail({
            from: "frisk2410006@outlook.com",
            to: email,
            subject: "注册验证码",
            text: `您正在申请邮箱注册，验证码为：${verificationCode}，5分钟内有效！`
        })
        console.log(verificationCode);
        res.status(200).send("验证码发送成功！");

    } catch (err) {
        next(err);
    }
}

export const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const {name, email, password, verificationCode} = req.body;

        // 验证验证码
        const storedVerificationCode = verificationCodes.get(email);
        if (!storedVerificationCode || !(storedVerificationCode === verificationCode)) {
            return next(createError(400, "验证码无效或已过期"));
        }

        // 验证通过，删除存储的验证码
        verificationCodes.delete(email);

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const newUser = new user({...req.body, password: hash});
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT);
        res.cookie("access_token", token, {httpOnly: true}).status(200).json(newUser._doc);
        res.status(200).send("账户创建成功！");
    } catch (err) {
        next(err);
    }
}

export const signin = async (req, res, next) => {
    try {
        const userin = await user.findOne({name: req.body.name});
        if (!userin) return next(createError(404, "用户不存在"));

        const isCorrect = await bcrypt.compare(req.body.password, userin.password);
        if (!isCorrect) return next(createError(404, "密码错误"));

        const token = jwt.sign({id: userin._id}, process.env.JWT);
        const {password, ...others} = userin._doc;
        res.cookie("access_token", token, {httpOnly: true}).status(200).json(others);
    } catch (err) {
        next(err);
    }
}
