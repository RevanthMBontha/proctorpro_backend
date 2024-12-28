import jwt from "jsonwebtoken";
import User from "./../models/user.model.js";

export const loginUser = async (req, res) => {
  try {
    const { id, firstName, lastName, email, tests } = req.body;

    let user = await User.find({ email: email });

    if (!user[0]) {
      // Add user to the database
      user = await User.create({
        userId: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        tests: [],
      });
    }

    user = user[0];

    // Sign a jwt token and send it to the client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    return res.status(200).json({
      token,
      user,
      issuedAt: Date.now(),
      expiresIn: Date.now() + 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    let isAuthorized = true;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return false;

    if (new Date.now() > decoded.iat + decoded.exp) return false;

    res.status(200).json({ isAuthorized });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isAuthorized: false });
  }
};
