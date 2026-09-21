// Types
import type { ZodObject } from "zod";

// Modules
import z from "zod";

const createMovieSchema = z.object({
    title: z.string().min(1).max(255),
    overview: z.string().max(5000).optional().nullable(),
    releaseYear: z.number().int().min(1888).max(new Date().getFullYear() + 5),
    genres: z.array(z.string()).default([]),
    runtime: z.number().int().positive().optional().nullable(),
    posterUrl: z.string().url().optional().nullable()
});

const updateMovieSchema: ZodObject<any> = createMovieSchema.partial();

export { createMovieSchema, updateMovieSchema };
