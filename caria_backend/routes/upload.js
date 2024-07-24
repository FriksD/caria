import express from 'express';
import {uploadFiles, createVideo} from '../controllers/upload.js';
import {verifyToken} from '../verifyToken.js';  // 假设你有这个中间件来验证用户token

const router = express.Router();

router.post('/', verifyToken, uploadFiles, createVideo);

export default router;