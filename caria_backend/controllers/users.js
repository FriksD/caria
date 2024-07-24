import {createError} from "../error.js"
import user from "../models/user.js"
import video from "../models/video.js"

export const update = async (req, res, next) => {
    try {
        // 检查邮箱唯一性
        if (req.body.email) {
            const existingUser = await user.findOne({email: req.body.email});
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({message: "该邮箱已被使用"});
            }
        }

        // 检查用户名唯一性
        if (req.body.name) {
            const existingUser = await user.findOne({name: req.body.name});
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({message: "该用户名已被使用"});
            }
        }

        const updatedUser = await user.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        res.status(200).json(updatedUser)
    } catch (err) {
        next(err);
    }

}


export const deleteUser = async (req, res, next) => {
    try {
        await user.findByIdAndDelete(req.params.id)
        res.status(200).json("注销成功")
    } catch (err) {
        next(err);
    }

}


export const getUser = async (req, res, next) => {
    try {
        const userget = await user.findById(req.params.id);
        res.status(200).json(userget)
    } catch (err) {
        next(err);
    }
}

export const getAll = async (req, res, next) => {
    try {
        const userget = await user.find();
        res.status(200).json(userget)
    } catch (err) {
        next(err);
    }
}


export const subscribe = async (req, res, next) => {
    try {
        //订阅列表中添加用户
        await user.findByIdAndUpdate(req.user.id, {$addToSet: {subscribedUsers: req.params.id}});
        //被订阅者粉丝数量 +1
        await user.findByIdAndUpdate(req.params.id, {$inc: {subscribers: 1}});
        res.status(200).json("订阅成功");
    } catch (err) {
        next(err);
    }
}


export const unsubscribe = async (req, res, next) => {
    try {
        //订阅列表中删除用户
        await user.findByIdAndUpdate(req.user.id, {$pull: {subscribedUsers: req.params.id}});
        //被订阅者粉丝数量 -1
        await user.findByIdAndUpdate(req.params.id, {$inc: {subscribers: -1}});
        res.status(200).json("取消订阅成功");
    } catch (err) {
        next(err);
    }
}


export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId
    try {
        await video.findByIdAndUpdate(videoId, {$addToSet: {likes: id}, $pull: {dislikes: id}});
        res.status(200).json("点赞成功");
    } catch (err) {
        next(err);
    }
}


export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId
    try {
        await video.findByIdAndUpdate(videoId, {$addToSet: {dislikes: id}, $pull: {likes: id}});
        res.status(200).json("点踩成功");
    } catch (err) {
        next(err);
    }
}
