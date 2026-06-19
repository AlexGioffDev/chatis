import "dotenv/config"
import { NextFunction, Request, Response } from "express";

export const addInternalSecret = (req: Request, res: Response, next: NextFunction) => {
    req.headers["x-internal-secret"] = process.env.INTERNAL_SECRET!
    next();
}