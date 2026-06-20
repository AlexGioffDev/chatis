import "dotenv/config";
import { NextFunction, Request, Response } from "express";

export const checkSecret = (req: Request, res: Response, next: NextFunction) => {
    const secret = req.headers['x-internal-secret']

    if (secret !== process.env.INTERNAL_SECRET) {
        return res.status(403).json({
            error: "Forbidden",
            message: "Access denied"
        })
    }

    next()
}