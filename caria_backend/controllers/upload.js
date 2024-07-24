import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import Video from '../models/video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置 multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 100 * 1024 * 1024}  // 限制文件大小为 100MB
});

export const uploadFiles = upload.fields([
    {name: 'video', maxCount: 1},
    {name: 'img', maxCount: 1}
]);

export const createVideo = async (req, res) => {
    if (!req.files || !req.files.video || !req.files.img) {
        return res.status(400).json({success: false, message: '视频和缩略图都需要上传。'});
    }

    const {title, desc, tags} = req.body;
    const videoUrl = `/uploads/${req.files.video[0].filename}`;
    const imgUrl = `/uploads/${req.files.img[0].filename}`;

    try {
        const newVideo = new Video({
            userId: req.user.id,
            title,
            desc,
            videoUrl,
            imgUrl,
            tags: tags.split(','),

        });

        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};