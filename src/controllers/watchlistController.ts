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
            return res.status(404).json({ 
                error: "Movie not found." 
            });
        }
        
        // Check if the user already has the movie in their watchlist
        const existingInWatchlist = await prisma.watchlistItem.findUnique({
            where: { 
                userId_movieId: { userId, movieId }
            }
        });

        if (existingInWatchlist) {
            return res.status(400).json({ 
                error: `Movie already in user's watchlist.` 
            });
        }

        // Add the movie to the user's watchlist
        const newWatchlistItem = await prisma.watchlistItem.create({
            data: {
                userId,
                movieId,
                watchlistStatus: status as WatchlistStatus,
                rating,
                notes
            }
        });

        res.status(201).json({
            status: "success",
            message: `Successfully added movie to user's watchlist.`,
            data: { watchlistItem: newWatchlistItem }
        });
    }

    static async updateWatchlistItem(req: Request<{id: string}>, res: Response) {
        const { id } = req.params;

        const userId = req.user?.id as string;

        // Get the watchlist item
        const watchlistItem = await prisma.watchlistItem.findUnique({
            where: { id }
        });

        // Check if the watchlist item exists
        if (!watchlistItem) {
            return res.status(404).json({ 
                error: `Watchlist item does not exist.` 
            });
        }

        // Check if the watchlist item belongs to the user
        if (watchlistItem.userId !== req.user?.id) {
            return res.status(403).json({ 
                error: `Watchlist item does not belong to user.`
            });
        }

        const { status, notes, rating }: {
            status: string,
            notes: string,
            rating: number
        } = req.body;

        const updateData: {
            status?: WatchlistStatus,
            notes?: string,
            rating?: number
        } = {};

        if (status !== undefined) {
            updateData.status = status.toUpperCase() as WatchlistStatus;
        }

        if (notes !== undefined) {
            updateData.notes = notes;
        }

        if (rating !== undefined) {
            updateData.rating = rating;
        }

        const updatedWatchlistItem = await prisma.watchlistItem.update({
            where: { id },
            data: updateData
        });

        return res.status(200).json({
            status: "success",
            message: "Successfully updated user's watchlist item.",
            data: { watchlistItem: updatedWatchlistItem }
        });
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
            return res.status(404).json({ 
                error: `Watchlist item does not exist.` 
            });
        }

        // Check if the watchlist item belongs to the user
        if (watchlistItem.userId !== req.user?.id) {
            return res.status(403).json({ 
                error: `Watchlist item does not belong to user.`
            });
        }

        await prisma.watchlistItem.delete({
            where: { id }
        });

        res.status(200).json({
            status: "success",
            message: `Successfully deleted movie from user's watchlist.`
        });
    }
}