// Types
import type { Request, Response } from "express";

// Modules
import { prisma } from "../config/db.js";

export default class MovieController {
    static async getAllMovies(req: Request, res: Response) {
        const { page = "1", limit = "10" } = req.query as {
            page?: string;
            limit?: string;
        };

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (Number.isNaN(pageNumber) || Number.isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({
                error: "Page and limit must be positive numbers."
            });
        }

        const [movies, totalMovies] = await Promise.all([
            prisma.movie.findMany({
                skip: (pageNumber - 1) * limitNumber,
                take: limitNumber,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma.movie.count()
        ]);

        res.status(200).json({
            status: "success",
            data: {
                movies,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total: totalMovies,
                    totalPages: Math.ceil(totalMovies / limitNumber)
                }
            }
        });
    }

    static async getMovieById(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const movie = await prisma.movie.findUnique({
            where: { id },
            include: {
                watchlistItems: true
            }
        });

        if (!movie) {
            return res.status(404).json({
                error: "Movie not found."
            });
        }

        res.status(200).json({
            status: "success",
            data: { movie }
        });
    }

    static async createMovie(req: Request, res: Response) {
        const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body as {
            title: string;
            overview?: string | null;
            releaseYear: number;
            genres?: string[];
            runtime?: number | null;
            posterUrl?: string | null;
        };

        const movie = await prisma.movie.create({
            data: {
                title,
                overview: overview ?? null,
                releaseYear,
                genres: genres ?? [],
                runtime: runtime ?? null,
                posterUrl: posterUrl ?? null,
                creatorId: req.user?.id as string
            }
        });

        res.status(201).json({
            status: "success",
            message: "Successfully created movie.",
            data: { movie }
        });
    }

    static async updateMovie(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const existingMovie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!existingMovie) {
            return res.status(404).json({
                error: "Movie not found."
            });
        }

        if (existingMovie.creatorId !== req.user?.id) {
            return res.status(403).json({
                error: "Movie does not belong to user."
            });
        }

        const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body as {
            title?: string;
            overview?: string | null;
            releaseYear?: number;
            genres?: string[];
            runtime?: number | null;
            posterUrl?: string | null;
        };

        const updateData: {
            title?: string;
            overview?: string | null;
            releaseYear?: number;
            genres?: string[];
            runtime?: number | null;
            posterUrl?: string | null;
        } = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (overview !== undefined) {
            updateData.overview = overview;
        }

        if (releaseYear !== undefined) {
            updateData.releaseYear = releaseYear;
        }

        if (genres !== undefined) {
            updateData.genres = genres;
        }

        if (runtime !== undefined) {
            updateData.runtime = runtime;
        }

        if (posterUrl !== undefined) {
            updateData.posterUrl = posterUrl;
        }

        const movie = await prisma.movie.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({
            status: "success",
            message: "Successfully updated movie.",
            data: { movie }
        });
    }

    static async deleteMovie(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const existingMovie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!existingMovie) {
            return res.status(404).json({
                error: "Movie not found."
            });
        }

        if (existingMovie.creatorId !== req.user?.id) {
            return res.status(403).json({
                error: "Movie does not belong to user."
            });
        }

        await prisma.movie.delete({
            where: { id }
        });

        res.status(200).json({
            status: "success",
            message: "Successfully deleted movie."
        });
    }
}
