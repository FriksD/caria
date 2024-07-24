import express from "express";
import {update, getUser, deleteUser, subscribe, unsubscribe, like, dislike, getAll} from "../controllers/users.js";
import {verifyAdminToken, verifyToken} from "../verifyToken.js";

const router = express.Router();


// 更新用户
router.put("/:id", verifyAdminToken, update);

// 注销用户
router.delete("/:id", verifyAdminToken, deleteUser);

//获取用户
router.get("/find/:id", getUser);

//获取所有用户
router.get("/findall", getAll);

//订阅用户
router.put("/sub/:id", verifyToken, subscribe);

//取消订阅
router.put("/unsub/:id", verifyToken, unsubscribe);

//点赞视频
router.put("/like/:videoId", verifyToken, like);

//取消点赞
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;