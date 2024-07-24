import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {createError} from "../error.js";

export const adminSignup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newAdmin = new Admin({...req.body, password: hash});

        await newAdmin.save();
        res.status(200).send("管理员已创建成功。");
    } catch (err) {
        next(err);
    }
};

export const adminSignin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({username: req.body.username});
        if (!admin) return next(createError(404, "管理员不存在"));

        const isCorrect = await bcrypt.compare(req.body.password, admin.password);
        if (!isCorrect) return next(createError(400, "密码错误"));

        const token = jwt.sign({id: admin._id}, process.env.ADMIN_JWT_SECRET);
        const {password, ...others} = admin._doc;

        res
            .cookie("admin_access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(others);
    } catch (err) {
        next(err);
    }
};

export const adminLogout = async (req, res) => {
    res.clearCookie("admin_access_token").status(200).json("管理员已退出登录");
};