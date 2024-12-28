import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: "User",
    },
    lastName: {
      type: String,
      default: "Name",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tests: {
      type: [Schema.Types.ObjectId],
      ref: "Test",
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
