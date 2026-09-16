// Types
import type { Request, Response } from "express";

// Modules
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

export default class AuthController {
    static async register(req: Request, res: Response) {
        const { name, email, password }: { 
            name: string; 
            email: string; 
            password: string 
        } = req.body;

        const existingUser = await prisma.user.findUnique({ 
            where: { email }
        });
        
        if (existingUser) {
            return res
                    .status(400)
                    .json({ error: "A user already exists with this email address." });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await prisma.user.create({ data: {
            name,
            email,
            password: hashedPassword
        }});

        res
        .status(201)
        .json({
            status: "success",
            data: { user }
         });
    }
}