// Middlewares
import authMiddleware from "../middleware/authMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

// Controllers
import MovieController from "../controllers/movieController.js";

// Validators
import { createMovieSchema, updateMovieSchema } from "../validators/movieValidator.js";

import { Router } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/", MovieController.getAllMovies);
router.get("/:id", MovieController.getMovieById);
router.post("/", validationMiddleware(createMovieSchema), MovieController.createMovie);
router.put("/:id", validationMiddleware(updateMovieSchema), MovieController.updateMovie);
router.delete("/:id", MovieController.deleteMovie);

export default router;
