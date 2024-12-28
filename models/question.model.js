import { Schema, model } from "mongoose";

const questionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["mcq", "categorise", "cloze", "comprehension"],
      default: "mcq",
    },
    questionText: { type: String, default: "" },
    questionImg: { type: String, default: "" },
    options: { type: [Object], default: [] },
    correctAnswer: { type: Schema.Types.Mixed, default: null },
    points: { type: Number, default: 0 },
    clozeText: { type: String, default: "" },
    subQuestions: {
      type: [Schema.Types.ObjectId],
      ref: "Question",
      default: [],
    },
    categories: { type: [Object], default: [] },
    items: { type: [Object], default: [] },
  },
  { timestamps: true }
);

const Question = model("Question", questionSchema);

export default Question;
