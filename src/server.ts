import express from "express";
import { config } from "dotenv";
import { connectDb, disconnectDb } from "./config/db.js";

// Routers
// import authRouter from "./routes/authRoutes.js";

// .env loader
config();
connectDb();

// Server Config
const PORT = 3000;
const app = express();

// app.use("/auth", authRouter);

const server = app.listen(PORT, () => {
    console.log(`Running locally on http://localhost:${PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled rejection: ${err}`);
    server.close(async () => {
        await disconnectDb();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error(`Uncaught exception: ${err}`);
    
    await disconnectDb();
    process.exit(1);
})

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    
    server.close(async () => {
        await disconnectDb();
        process.exit(0);
    });
});