import jwt from "jsonwebtoken"
import {createError} from "./error.js"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(createError(401, "用户未登录"));

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "无效的用户凭证"));
        req.user = user;
        next();
    });

}


export const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.admin_access_token;
    if (!token) return next(createError(401, "管理员未登录"));

    jwt.verify(token, process.env.ADMIN_JWT_SECRET, (err, admin) => {
        if (err) return next(createError(403, "无效的管理员凭证"));
        req.admin = admin;
        next();
    });
};