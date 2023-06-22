import express from "express";
import jwt from "jsonwebtoken";

export const checkAuth = async (req: any, res: express.Response, next: express.NextFunction) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "")

    if (!token) {
        res.status(401).json({
            status: "error",
            message: "no_access",
        })
        return
    }
    try {
        const decoded: any = jwt.verify(token, "secretCode")
        //@ts-ignore
        req.userId = decoded._id
        next()
    } catch (err) {
        res.status(401).json({
            status: "error",
            message: "no_access",
        })
        return
    }
}