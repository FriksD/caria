import express from "express";
import {
    addVideo,
    deleteVideo,
    updateVideo,
    getVideo,
    addView,
    randomVideo,
    trend,
    sub,
    getByTag,
    search, getAll, getUserVideos, getLikedVideos
} from "../controllers/videos.js";
import {verifyAdminToken, verifyToken} from "../verifyToken.js"
import {getHistory} from "../controllers/users.js";

const router = express.Router();

//添加视频
router.post("/", verifyToken, addVideo);

//删除视频
router.delete("/:id", verifyAdminToken, deleteVideo);

//更新视频
router.put("/:id", verifyAdminToken, updateVideo);

//搜索视频
router.get("/find/:id", getVideo);

//增加播放量
router.put("/view/:id", addView);

//随机展示主页视频
router.get("/random", randomVideo);

//获取所有视频
router.get("/findall", getAll);

//排行榜
router.get("/trend", trend);

//获取一个用户上传的所有视频
router.get("/user/:id", getUserVideos);

//获取一个用户喜欢的所有视频
router.get("/liked/:id", getLikedVideos);

//获取用户的历史记录
router.get("/history", verifyToken, getHistory);

//查看订阅的所有视频
router.get("/sub", verifyToken, sub);

//按标签搜索
router.get("/tags", verifyToken, getByTag);

//按标题搜索
router.get("/search", search);

//增加播放量
router.get("/view", addView);

export default router;