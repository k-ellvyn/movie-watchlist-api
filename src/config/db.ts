import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"]
});

const connectDb = async () => {
    try {
        prisma.$connect();
        console.log("DB Connected via Prisma");
    } catch (e) {
        console.log(`Database connection error: ${e}`);
        process.exit(1);
    }
}

const disconnectDb = async () => {
    await prisma.$disconnect();
}

export { prisma, connectDb, disconnectDb }