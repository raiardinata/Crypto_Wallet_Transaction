import { Router } from "express";
import { LoginUser } from "../controllers/loginController";

const router = Router();

// default wallet endpoint
router.get('/', LoginUser);

export default router;
