import { v4 as uuidv4 } from "uuid";
import Question from "./../models/question.model.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/aws.js";

export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate("subQuestions");

    return res.status(200).json({ question });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ err: error });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    let parsedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key, JSON.parse(value)])
    );

    const { id } = req.params;
    const file = req.file;

    if (file) {
      let finalParsed;
      const key = `uploads/${Date.now()}_${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const data = await s3.send(command);

      // Construct the file URL
      let fileURL = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      finalParsed = { ...parsedBody, questionImg: fileURL };

      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        finalParsed,
        { new: true }
      );

      return res.status(200).json({ question: updatedQuestion });
    } else {
      const updatedQuestion = await Question.findByIdAndUpdate(id, {
        type: parsedBody.type,
        questionText: parsedBody.questionText,
        options: parsedBody.options,
        correctAnswer: parsedBody.correctAnswer,
        clozeText: parsedBody.clozeText,
        points: parsedBody.points,
        subQuestions: parsedBody.subQuestions,
        categories: parsedBody.categories,
        items: parsedBody.items,
      });

      return res.status(200).json({ question: updatedQuestion });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ err: error });
  }
};

export const addSubQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const newSubQuestion = await Question.create(req.body);

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        $push: { subQuestions: newSubQuestion._id },
        type: "comprehension",
      },
      { new: true }
    );

    return res.status(200).json({ question: updatedQuestion });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ err: error });
  }
};

export const updateSubQuestion = async (req, res) => {
  try {
    let parsedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key, JSON.parse(value)])
    );

    const { qId, subId } = req.params;
    const file = req.file;

    if (file) {
      let finalParsed;
      const key = `uploads/${Date.now()}_${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const data = await s3.send(command);

      // Construct the file URL
      let fileURL = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      finalParsed = { ...parsedBody, questionImg: fileURL };

      const updatedQuestion = await Question.findByIdAndUpdate(
        subId,
        finalParsed,
        { new: true }
      );

      return res.status(200).json({ question: updatedQuestion });
    } else {
      const updatedQuestion = await Question.findByIdAndUpdate(subId, {
        type: parsedBody.type,
        questionText: parsedBody.questionText,
        options: parsedBody.options,
        correctAnswer: parsedBody.correctAnswer,
        clozeText: parsedBody.clozeText,
        points: parsedBody.points,
        subQuestions: parsedBody.subQuestions,
        categories: parsedBody.categories,
        items: parsedBody.items,
      });

      return res.status(200).json({ question: updatedQuestion });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ err: error });
  }
};
