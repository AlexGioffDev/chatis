import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma.js";
import { generateToken, getTokenPayload } from "../lib/jwt.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "You must to pass all the fields!"
            })
        }

        if (email.trim() === "" || password.trim() === "") {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "All the fields must have a value!"
            })
        }

        const hashedPassowrd = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email, password: hashedPassowrd
            }
        });

        const token = generateToken(user.userId);

        return res.status(201).json({
            "message": "User Created!",
            "user": {
                "email": user.email,
                "id": user.userId
            },
            "token": token
        })


    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({
                "error": "Conflict",
                "message": "Username or Email already used!"
            })
        }

        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong with the server, try again!"
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "You must to pass all the fields!"
            })
        }

        if (email.trim() === "" || password.trim() === "") {
            return res.status(400).json({
                "error": "Bad Request",
                "message": "All the fields must have a value!"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({
                "error": "Invalid Value",
                "message": "A field is not valid, try again! "
            })
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                "error": "Invalid Value",
                "message": "A field is not valid, try again!"
            })
        }

        const token = generateToken(user.userId);

        return res.status(200).json({
            "token": token,
            "user": {
                "email": user.email,
                "id": user.userId
            }
        })


    } catch (error) {
        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong wit the server, try again later!"
        })
    }
}

export const verifyToken = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];



        if (!token) {
            return res.status(401).json({
                "error": "Token missed",
                "message": "Pass a valid token"
            })
        }

        const payload = getTokenPayload(token);

        const user = await prisma.user.findUnique({
            where: {
                userId: payload.userId
            }
        })

        if (!user) {
            return res.status(401).json({
                "error": "User Not found",
                "message": "The token you are using is of an user that dosen't exist anymore!"
            })
        }

        return res.status(200).json({
            "user_id": payload.userId
        })

    } catch (error) {
        return res.status(401).json({
            "error": "Invalid Token",
            "message": "Token is not valid!"
        })
    }
}