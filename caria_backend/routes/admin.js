import express from "express";
import {adminSignin, adminSignup, adminLogout} from "../controllers/admin.js";
import {verifyAdminToken} from "../verifyToken.js";

const router = express.Router();

// 创建新管理员（这个路由应该被保护或者只在初始化时使用）
router.post("/signup", adminSignup);

// 管理员登录
router.post("/signin", adminSignin, verifyAdminToken);

// 管理员登出
router.post("/logout", adminLogout);

// 示例：受保护的管理员路由
router.get("/test", verifyAdminToken, (req, res) => {
    res.json({message: "这是一个受保护的管理员路由"});
});

export default router;