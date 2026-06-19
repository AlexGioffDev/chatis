import "dotenv/config"

import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export const generateToken = (userId: number) => {
    return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}


export const getTokenPayload = (token: string) => {
    return jwt.verify(token, secret) as { userId: number }
}