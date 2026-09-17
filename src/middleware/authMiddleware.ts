// Types
import type { NextFunction, Request, Response } from "express";

// Modules
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

declare global {
    namespace Express {
        interface Request {
            user?: Awaited<ReturnType<typeof prisma.user.findUnique>>;
        }
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token = "";

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1] as string;
    }
    else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (token.length === 0) {
        return res
            .status(401)
            .json({ error: "Not authorized." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        });

        if (!user) {
            return res
                .status(401)
                .json({ error: "User does not exist." });
        }

        req.user = user;

        next();
    }
    catch (err) {
        return res
            .status(401)
            .json({ error: "Not authorized." });
    }
};

export default authMiddleware;