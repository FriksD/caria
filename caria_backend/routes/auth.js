import express from "express";
import {signin, register, sendVerificationCode} from "../controllers/auth.js";

const router = express.Router();

//创建用户
router.post("/signup", register);

//登录
router.post("/signin", signin);

//发送验证码
router.post("/sendCode", sendVerificationCode);


export default router;
