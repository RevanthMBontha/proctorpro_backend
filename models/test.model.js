import { Schema, model } from "mongoose";

const testSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    testImg: { type: String, default: "" },
    questions: { type: [Schema.Types.ObjectId], ref: "Question", default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    attempts: { type: [Schema.Types.ObjectId], ref: "Attempt", default: [] },
  },
  { timestamps: true }
);

const Test = model("Test", testSchema);

export default Test;
