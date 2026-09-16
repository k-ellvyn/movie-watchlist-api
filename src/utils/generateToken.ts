// Types
import type { Response } from "express";

import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response) => {
    const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN!);

    const payload = {
        id: userId
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: JWT_EXPIRES_IN 
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: JWT_EXPIRES_IN * 1000
    });

    return token;
}