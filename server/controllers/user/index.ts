import express from "express";
import * as usersController from "./userController";

let router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);

export default router;
