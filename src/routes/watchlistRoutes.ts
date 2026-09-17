// Middlewares
import authMiddleware from "../middleware/authMiddleware.js";

// Controllers
import WatchlistController from "../controllers/watchlistController.js";

import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.post("/:movieId", WatchlistController.addToWatchlist);
router.delete("/:id", WatchlistController.removeFromWatchlist);

export default router;