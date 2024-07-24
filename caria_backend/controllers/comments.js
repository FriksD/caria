import {createError} from "../error.js";
import comment from "../models/comments.js"
import video from "../models/video.js"


export const addComment = async (req, res, next) => {
    const newComment = new comment({...req.body, userId: req.user.id})
    try {
        const savedComment = await newComment.save();
        res.status(200).send(savedComment);
    } catch (err) {
        next(err);
    }
}


export const deleteComment = async (req, res, next) => {
    try {
        const commentDelete = await comment.findById(res.params.id);
        const videoDelete = await video.findById(res.params.id);
        if (req.user.id === commentDelete.userId || req.user.id === videoDelete.userId) {
            await comment.findByIdAndDelete(req.params.id);
            res.status(200).json("评论已删除");
        } else {
            next(createError(403, "无删除权限"))
        }
    } catch (err) {
        next(err);
    }
}


export const getComment = async (req, res, next) => {
    try {
        const comments = await comment.find({videoId: req.params.videoId});
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}


// export const addComment = async (req, res, next)=>{
//     try{

//     }catch(err){
//         next(err);
//     }
// } 