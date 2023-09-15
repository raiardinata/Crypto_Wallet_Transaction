"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createUserController_1 = require("../controllers/createUserController");
const router = (0, express_1.Router)();
// default wallet endpoint
router.post('/', createUserController_1.createUser);
exports.default = router;
