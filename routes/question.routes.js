import { Router } from "express";
import {
  addSubQuestion,
  getQuestion,
  updateQuestion,
  updateSubQuestion,
} from "./../controllers/question.controller.js";
import { upload } from "../utils/aws.js";

const router = Router();

router
  .route("/:id")
  .get(getQuestion)
  .post(addSubQuestion)
  .patch(upload.single("file"), updateQuestion);

router.route("/:qId/:subId").patch(upload.single("file"), updateSubQuestion);

export default router;
