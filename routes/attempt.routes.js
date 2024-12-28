import { Router } from "express";
import { addAttempt, getAttempt } from "../controllers/attempt.controller.js";

const router = Router();

router.route("/").post(addAttempt);

router.route("/:id").get(getAttempt);

export default router;
