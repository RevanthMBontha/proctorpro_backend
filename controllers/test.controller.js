import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import User from "../models/user.model.js";
import Test from "./../models/test.model.js";
import { s3 } from "../utils/aws.js";
import Question from "./../models/question.model.js";

export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user._id });
    res.status(200).json({ tests });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

export const getTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).populate("questions");
    res.status(200).json({ test });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ err: error.message });
  }
};

export const createTest = async (req, res) => {
  try {
    const { title, description, testImg, questions, attempts } = req.body;

    // Create the test
    const test = await Test.create({
      title,
      description,
      testImg,
      questions,
      createdBy: req.user._id,
      attempts,
    });

    // Attach it to the User who created the test
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          tests: test._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({ test });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ err: error.message });
  }
};

export const updateTest = async (req, res) => {
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
        Body: file.buffer, // Single file's buffer
        ContentType: file.mimetype, // Single file's MIME type
      });

      const data = await s3.send(command); // Upload file to S3

      // Construct the file URL
      let fileURL = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      finalParsed = { ...parsedBody, testImg: fileURL };

      const updatedTest = await Test.findByIdAndUpdate(id, finalParsed, {
        new: true,
      });

      return res.status(200).json({ test: updatedTest });
    } else {
      const updatedTest = await Test.findByIdAndUpdate(
        id,
        {
          title: parsedBody.title,
          description: parsedBody.description,
          questions: parsedBody.questions,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({ test: updatedTest });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ err: error });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      questionText,
      options,
      correctAnswer,
      clozeText,
      subQuestions,
      categories,
      items,
    } = req.body;

    // Create the question
    const question = await Question.create({
      type,
      questionText,
      options,
      correctAnswer,
      clozeText,
      subQuestions,
      categories,
      items,
    });

    // Add it to the Test
    const thisTest = await Test.findByIdAndUpdate(id, {
      $push: { questions: question._id },
    });

    return res.status(200).json({ test: thisTest });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ err: error });
  }
};
