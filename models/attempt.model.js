import { Schema, model } from "mongoose";

const attemptSchema = new Schema(
  {
    attemptedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    solutions: {
      type: Object,
      default: [],
    },
  },
  { timestamps: true }
);

const Attempt = model("Attempt", attemptSchema);

export default Attempt;
