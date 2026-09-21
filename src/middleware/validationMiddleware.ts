import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

const validationMiddleware = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessage = result.error.issues.map((err) => err.message).join(", ");

            return res.status(400).json({
                error: errorMessage
            });
        }

        next();
    };
};

export default validationMiddleware;