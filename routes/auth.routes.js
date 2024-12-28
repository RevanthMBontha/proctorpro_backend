import { Router } from "express";
import { loginUser, verifyUser } from "./../controllers/auth.controller.js";

const router = Router();

router.route("/login").post(loginUser);

router.route("/verify").get(verifyUser);

export default router;
