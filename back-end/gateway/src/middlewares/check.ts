import { NextFunction, Request, Response } from "express";

export const GuestOnly = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next();

    const authRes = await fetch("http://auth-service:3001/verify", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (authRes.ok) {
        return res.status(403).json({
            "error": "Forbiden",
            "message": "You can't do this action if are already logged!"
        })
    }

    return next();
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: "Unauthorized", message: "No token provided!" })
    }

    const authRes = await fetch("http://auth-service:3001/verify", {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!authRes.ok) {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" })
    }

    const { userId } = await authRes.json()
    req.headers['x-user-id'] = String(userId)
    next()
}

export const hasAccount = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id']

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized", message: "No user id provided!" })
    }

    const accountRes = await fetch(`http://account-service:3002/me`, {
        headers: {
            'x-internal-secret': process.env.INTERNAL_SECRET!,
            'x-user-id': String(userId)
        }
    })

    if (!accountRes.ok) {
        return res.status(403).json({
            error: "Forbidden",
            message: "You need an account to chat!"
        })
    }

    const { account } = await accountRes.json()
    req.headers['x-account-id'] = String(account.accountId)
    next()
}