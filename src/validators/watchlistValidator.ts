// Types
import type { ZodObject } from "zod";

// Modules
import z from "zod";

// Schemas
const statusSchema = z.enum([
    "PLANNED",
    "WATCHING",
    "COMPLETED",
    "DROPPED"
]).optional();
const ratingSchema = z.int().min(1).max(10).optional();

const addToWatchlistSchema = z.object({
    movieId: z.uuid(),
    status: statusSchema,
    rating: ratingSchema,
    notes: z.string().optional()
});

const updateWatchlistItemSchema = z.object({
    status: statusSchema,
    rating: ratingSchema,
    notes: z.string().optional()
});

export { 
    addToWatchlistSchema, 
    updateWatchlistItemSchema 
};