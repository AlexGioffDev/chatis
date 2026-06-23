import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createChat = async (req: Request, res: Response) => {
    try {
        const { accountB } = req.body;
        const accountA = Number(req.headers['x-account-id']);

        if (!accountB || isNaN(accountA)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Missing required fields"
            })
        }

        const [a, b] = [accountA, Number(accountB)].sort((x, y) => x - y)

        const chat = await prisma.chat.upsert({
            where: {
                account_a_account_b: { account_a: a, account_b: b },
            },
            update: {},
            create: { account_a: a, account_b: b }
        })

        return res.status(201).json({ chat })

    } catch (error) {
        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong with the server, try again later!"
        })
    }
}

export const getMyChats = async (req: Request, res: Response) => {
    try {
        const accountId = Number(req.headers['x-account-id'])

        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    { account_a: accountId },
                    { account_b: accountId }
                ]
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        return res.status(200).json({ chats })
    } catch (error) {
        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Something went wrong with the server, try again later!"
        })
    }
}

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params
        const accountId = Number(req.headers['x-account-id'])

        const chat = await prisma.chat.findUnique({
            where: { chat_id: Number(chatId) }
        })

        if (!chat) {
            return res.status(404).json({
                error: "Not Found",
                message: "Chat not found!"
            })
        }

        if (chat.account_a !== accountId && chat.account_b !== accountId) {
            return res.status(403).json({
                error: "Forbidden",
                message: "You are not part of this chat!"
            })
        }

        const messages = await prisma.message.findMany({
            where: { chatId: Number(chatId) },
            orderBy: { createdAt: 'asc' }
        })

        return res.status(200).json({ messages })

    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong!"
        })
    }
}