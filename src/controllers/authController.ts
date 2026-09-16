// Types
import type { Request, Response } from "express";

// Modules
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

// Utils
import { generateToken } from "../utils/generateToken.js";

export default class AuthController {
    static async register(req: Request, res: Response) {
        const { name, email, password }: { 
            name: string; 
            email: string; 
            password: string 
        } = req.body;

        // Check if the email address is in use
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
        const newUser = await prisma.user.create({ data: {
            name,
            email,
            password: hashedPassword
        }});

        const token = generateToken(newUser.id, res);

        res
        .status(201)
        .json({
            status: "success",
            data: { 
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                },
                token
            }
         });
    }

    static async login(req: Request, res: Response) {
        const ERROR_MESSAGE = "Email address or password is incorrect.";

        const { email, password }: { 
            email: string; 
            password: string 
        } = req.body;

        // Check if an account with the provided email address exists
        const existingUser = await prisma.user.findUnique({ 
            where: { email }
        });

        if (!existingUser) {
            return res
                    .status(401)
                    .json({ error: ERROR_MESSAGE});
        }

        // Check if the password supplied is the correct password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res
                    .status(401)
                    .json({ error: ERROR_MESSAGE });
        }

        // Generate a JSON Web Token for the client
        const token = generateToken(existingUser.id, res);

        res
        .status(201)
        .json({
            status: "success",
            data: { 
                user: {
                    id: existingUser.id,
                    email: existingUser.email
                },
                token
            }
         });
    }

    static async logout(req: Request, res: Response) {
        // Delete any potential JWT for the client
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        res
        .status(200)
        .json({
            status: "success",
            message: "Successfully logged out!"
        });
    }
}