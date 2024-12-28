import { Router } from "express";
import {
  getAllTests,
  getTest,
  createTest,
  updateTest,
  addQuestion,
} from "./../controllers/test.controller.js";
import { upload } from "./../utils/aws.js";

const router = Router();

router.route("/").get(getAllTests).post(createTest);

router.route("/:id").get(getTest).patch(upload.single("file"), updateTest);

router.route("/:id/addQuestion").post(addQuestion);

export default router;
