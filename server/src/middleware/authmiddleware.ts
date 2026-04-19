import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { errorResponse } from "../utils/error.js";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("auth middleware error", error);
        return errorResponse(res, 401, "Invalid token");
    }
};