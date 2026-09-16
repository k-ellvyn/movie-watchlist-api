// Controllers
import AuthController from "../controllers/authController.js";

import { Router } from "express";

const router = Router();

router.post("/register", AuthController.register);

export default router;