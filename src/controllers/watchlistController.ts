// Types
import type { Request, Response } from "express";
import { WatchlistStatus } from "@prisma/client";

// Modules
import { prisma } from "../config/db.js";

export default class WatchlistController {
    static async addToWatchlist(req: Request<{ movieId: string }>, res: Response) {
        const { movieId } = req.params;

        const { status, rating, notes }: {
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
                    .json({ error: `Movie already in user's watchlist.` });
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
            message: `Successfully added movie '${existingMovie.title}' to user's watchlist.`,
            data: { watchlistItem: newWatchlistItem }
        })
    }

    static async removeFromWatchlist(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;

        const userId = req.user?.id as string;

        // Get the watchlist item
        const watchlistItem = await prisma.watchlistItem.findUnique({
            where: { id }
        });

        // Check if the watchlist item exists
        if (!watchlistItem) {
            return res
                    .status(404)
                    .json({ error: `Watchlist item does not exist.` });
        }

        // Check if the watchlist item belongs to the user
        if (watchlistItem.userId !== req.user?.id) {
            return res
                    .status(403)
                    .json({ error: `Watchlist item does not belong to user.`});
        }

        // Get the watchlist item's movie
        const watchlistItemMovie = await prisma.movie.findUnique({
            where: { id: watchlistItem.movieId }
        });

        await prisma.watchlistItem.delete({
            where: { id }
        });

        res
        .status(200)
        .json({
            status: "success",
            message: `Successfully deleted movie '${watchlistItemMovie?.title}' from user's watchlist.`
        });
    }
}