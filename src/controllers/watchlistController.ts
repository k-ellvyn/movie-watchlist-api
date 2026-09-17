// Types
import type { Request, Response } from "express";
import { WatchlistStatus } from "@prisma/client";

// Modules
import { prisma } from "../config/db.js";

export default class WatchlistController {
    static async addToWatchlist(req: Request, res: Response) {
        const { movieId, status, rating, notes }: {
            movieId: string,
            status: string,
            rating: number,
            notes: string
        } = req.body;

        const userId = req.user?.id as string;

        // Check whether the movie exists
        const existingMovie = await prisma.movie.findUnique({
             where: { id: movieId }
        });

        if (!existingMovie) {
            return res
                    .status(404)
                    .json({ error: "Movie not found." });
        }
        
        // Check if the user already has the movie in their watchlist
        const existingInWatchlist = await prisma.watchlistItem.findUnique({
            where: { 
                userId_movieId: { userId, movieId }
            }
        });

        if (existingInWatchlist) {
            return res
                    .status(400)
                    .json({ error: "Movie already in watchlist." });
        }

        // Add the movie to the user's watchlist
        const watchlistStatus = status as WatchlistStatus;

        const newWatchlistItem = await prisma.watchlistItem.create({
            data: {
                userId,
                movieId,
                watchlistStatus,
                rating,
                notes
            }
        });

        res
        .status(201)
        .json({
            status: "success",
            data: { watchlistItem: newWatchlistItem }
        })
    }
}