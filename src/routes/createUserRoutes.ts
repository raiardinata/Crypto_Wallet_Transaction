import { Router } from "express";
import { createUser } from "../controllers/createUserController";

const router = Router();

// default wallet endpoint
router.post('/', createUser);

export default router
