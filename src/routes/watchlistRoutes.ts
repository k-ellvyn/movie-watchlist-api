// Middlewares
import authMiddleware from "../middleware/authMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

// Controllers
import WatchlistController from "../controllers/watchlistController.js";

// Validators
import { addToWatchlistSchema, updateWatchlistItemSchema } from "../validators/watchlistValidator.js";

import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/", WatchlistController.getWatchlist);
router.get("/:id", WatchlistController.getWatchlistItemById);
router.post(
    "/", 
    validationMiddleware(addToWatchlistSchema), 
    WatchlistController.addToWatchlist
);
router.put(
    "/:id",
    validationMiddleware(updateWatchlistItemSchema),
    WatchlistController.updateWatchlistItem
);
router.delete("/:id", WatchlistController.removeFromWatchlist);

export default router;