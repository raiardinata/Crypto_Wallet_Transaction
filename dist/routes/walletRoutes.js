"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const walletController_1 = require("../controllers/walletController");
const router = (0, express_1.Router)();
// default wallet endpoint
router.get('/', walletController_1.getWallets);
exports.default = router;
