import { Router, type Response, type Request } from "express";
import { errorResponse } from "../utils/error";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { use } from "react";


const router = Router();



router.post("/register", async (req: Request, res: Response) => {

    try {



        const { username, password } = req.body;

        if (!username || !password) return errorResponse(res, 400, "All fields are required");

        const isUserExisted = await prisma.user.findUnique({ where: { username } });

        if (isUserExisted) return errorResponse(res, 400, "Username already exists");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        const token = jwt.sign({
            userId: user.id
        }, process.env.JWT_SECRET!,
            { expiresIn: "30d" });

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.log("signup error", error);
        return errorResponse(res, 500, "Internal server error");
    }

});

router.post("/login", async (req: Request, res: Response) => {

    try {
        const { username, password } = req.body;

        if (!username || !password) return errorResponse(res, 400, "All fields are required!")

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) return errorResponse(res, 400, "Invalid username or password!");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return errorResponse(res, 400, "Invalid username or password!");

        const token = jwt.sign({
            userId: user.id
        }, process.env.JWT_SECRET!,
            { expiresIn: "30d" });

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });


    } catch (error) {

        console.log("login error", error);
        return errorResponse(res, 500, "Internal server error");

    }



});

export default router;