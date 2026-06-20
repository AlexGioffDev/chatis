import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const createAccount = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.headers["x-user-id"]);

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                "error": "Invalid value",
                "message": "You have to pass a valid userId!"
            })
        }

        const { username, bio } = req.body;

        if (!username || username.trim() === "") {
            return res.status(400).json({
                "error": "Invalid value",
                "message": "You need to pass a valid username!"
            })
        }

        const avatar = createAvatar(initials, { seed: username }).toDataUri();

        const newAccount = await prisma.account.create({
            data: {
                userId,
                username,
                bio,
                avatar
            }
        })

        return res.status(201).json({
            "account": newAccount
        })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(409).json({
                "error": "Conflit",
                "message": "Account already present in the DB"
            })
        }

        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong with the server, try again later!"
        })
    }
}

export const profileExist = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.headers["x-user-id"]);

        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                "error": "Invalid value",
                "message": "You have to pass a valid userId!"
            })
        }

        const user = await prisma.account.findUnique({
            where: {
                userId: userId
            }
        })

        if (!user) {
            return res.status(404).json({
                "error": "Not Found",
                "message": "No account found for this user!"
            })
        }

        return res.status(200).json({ account: user })


    } catch (error) {
        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong with the server, try again later!"
        })
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { accountId } = req.params;
        const numberAccountId = Number(accountId);

        if (isNaN(numberAccountId)) {
            return res.status(400).json({
                "error": "Bad Value",
                "message": "Invalid params!"
            })
        }


        const account = await prisma.account.findUnique({
            where: {
                accountId: numberAccountId
            }
        })

        if (!account) {
            return res.status(404).json({
                "error": "Not Found",
                "message": "There is not user with this id!"
            })
        }

        return res.status(200).json({
            account: account
        })

    } catch (error) {
        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong with the server, try again later!"
        })
    }
}