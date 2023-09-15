import { Router } from "express";
import { getWallets } from "../controllers/getWalletController";

const router = Router();

// default wallet endpoint
router.get('/', getWallets);

export default router
