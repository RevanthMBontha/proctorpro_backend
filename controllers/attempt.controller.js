import lodash from "lodash";
import Attempt from "../models/attempt.model.js";
import Test from "../models/test.model.js";

const { isEqual } = lodash;

export const addAttempt = async (req, res) => {
  const test = { ...req.body.attemptData };
  const testId = req.body.testId;

  const areArraysSame = (arr1, arr2) => {
    // Check if both arrays have the same length
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sort both arrays and compare their stringified versions
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
  };

  let score = 0;
  Object.keys(test).forEach((key) => {
    if (test[key].type !== "categorise") {
      if (isEqual(test[key].submitted, test[key].correctAnswer))
        score = score + test[key].points;
    } else {
      const submittedAns = { ...test[key].submitted };
      const correctAns = { ...test[key].correctAnswer };
      let ansArray = [];
      Object.keys(submittedAns).forEach((key) => {
        if (areArraysSame(submittedAns[key], correctAns[key])) {
          ansArray.push(true);
        } else {
          ansArray.push(false);
        }
      });
      if (ansArray.includes(false)) {
        return;
      } else {
        score = score + test[key].points;
      }
    }
  });

  let total = 0;

  Object.keys(test).forEach((key) => {
    total = total + test[key].points;
  });

  const newAttempt = await Attempt.create({
    attemptedBy: req.user._id,
    solutions: { ...test },
    score: score,
    total: total,
  });

  const updatedTest = await Test.findByIdAndUpdate(
    testId,
    {
      $push: {
        attempts: newAttempt._id,
      },
    },
    { new: true }
  );

  res.status(200).json({ attempt: { ...newAttempt } });
};

export const getAttempt = async (req, res) => {
  const { id } = req.params;

  const attempt = await Attempt.findById(id);

  res.status(200).json({ attempt });
};
